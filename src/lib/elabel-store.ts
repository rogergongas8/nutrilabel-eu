import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type { WineInput } from "./wine-calculator";

/**
 * Persistence for hosted e-labels.
 *
 * Two adapters behind one interface:
 *  - Supabase (PostgREST over fetch, no SDK) when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set.
 *  - A JSON file in .data/ for local development only (refused in production).
 */

export type ELabelStatus = "pending" | "active";

export interface StoredELabel {
  id: string;
  status: ELabelStatus;
  /** sha256 hex of the secret edit token. The token itself is never stored. */
  editTokenHash: string;
  email: string | null;
  wine: WineInput;
  createdAt: string;
  /** ISO date until which the hosted page stays online. */
  paidUntil: string | null;
  stripeSessionId: string | null;
}

export interface ELabelStore {
  insert(label: StoredELabel): Promise<void>;
  get(id: string): Promise<StoredELabel | null>;
  activate(id: string, paidUntil: string, stripeSessionId: string): Promise<boolean>;
  updateWine(id: string, wine: WineInput): Promise<boolean>;
}

// ---------- helpers ----------

const ID_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"; // no look-alike chars

/** 8-char id → ~40 bits; short enough for a small QR, not guessable by enumeration at this scale. */
export function newId(len = 8): string {
  const bytes = randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) out += ID_ALPHABET[bytes[i] % ID_ALPHABET.length];
  return out;
}

export function newEditToken(): string {
  return randomBytes(24).toString("hex");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function tokenMatches(token: string, hash: string): boolean {
  const a = Buffer.from(hashToken(token), "hex");
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

// ---------- local file adapter (dev only) ----------

const DEV_FILE = path.join(process.cwd(), ".data", "elabels.json");

async function readDev(): Promise<Record<string, StoredELabel>> {
  try {
    return JSON.parse(await fs.readFile(DEV_FILE, "utf8"));
  } catch {
    return {};
  }
}

async function writeDev(db: Record<string, StoredELabel>) {
  await fs.mkdir(path.dirname(DEV_FILE), { recursive: true });
  await fs.writeFile(DEV_FILE, JSON.stringify(db, null, 2));
}

const fileStore: ELabelStore = {
  async insert(label) {
    const db = await readDev();
    db[label.id] = label;
    await writeDev(db);
  },
  async get(id) {
    return (await readDev())[id] ?? null;
  },
  async activate(id, paidUntil, stripeSessionId) {
    const db = await readDev();
    if (!db[id]) return false;
    db[id] = { ...db[id], status: "active", paidUntil, stripeSessionId };
    await writeDev(db);
    return true;
  },
  async updateWine(id, wine) {
    const db = await readDev();
    if (!db[id]) return false;
    db[id] = { ...db[id], wine };
    await writeDev(db);
    return true;
  },
};

// ---------- Supabase adapter ----------

interface Row {
  id: string;
  status: ELabelStatus;
  edit_token_hash: string;
  email: string | null;
  wine: WineInput;
  created_at: string;
  paid_until: string | null;
  stripe_session_id: string | null;
}

const fromRow = (r: Row): StoredELabel => ({
  id: r.id,
  status: r.status,
  editTokenHash: r.edit_token_hash,
  email: r.email,
  wine: r.wine,
  createdAt: r.created_at,
  paidUntil: r.paid_until,
  stripeSessionId: r.stripe_session_id,
});

function supabaseStore(url: string, key: string): ELabelStore {
  const base = `${url.replace(/\/$/, "")}/rest/v1/elabels`;
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
  return {
    async insert(l) {
      const res = await fetch(base, {
        method: "POST",
        headers,
        body: JSON.stringify({
          id: l.id,
          status: l.status,
          edit_token_hash: l.editTokenHash,
          email: l.email,
          wine: l.wine,
          created_at: l.createdAt,
          paid_until: l.paidUntil,
          stripe_session_id: l.stripeSessionId,
        }),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Supabase insert failed: ${res.status}`);
    },
    async get(id) {
      const res = await fetch(`${base}?id=eq.${encodeURIComponent(id)}&select=*`, {
        headers,
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Supabase get failed: ${res.status}`);
      const rows: Row[] = await res.json();
      return rows[0] ? fromRow(rows[0]) : null;
    },
    async activate(id, paidUntil, stripeSessionId) {
      const res = await fetch(`${base}?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { ...headers, Prefer: "return=representation" },
        body: JSON.stringify({
          status: "active",
          paid_until: paidUntil,
          stripe_session_id: stripeSessionId,
        }),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Supabase activate failed: ${res.status}`);
      const rows: Row[] = await res.json();
      return rows.length > 0;
    },
    async updateWine(id, wine) {
      const res = await fetch(`${base}?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { ...headers, Prefer: "return=representation" },
        body: JSON.stringify({ wine }),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Supabase update failed: ${res.status}`);
      const rows: Row[] = await res.json();
      return rows.length > 0;
    },
  };
}

export function getStore(): ELabelStore {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) return supabaseStore(url, key);
  if (process.env.NODE_ENV === "production") {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not configured");
  }
  return fileStore;
}
