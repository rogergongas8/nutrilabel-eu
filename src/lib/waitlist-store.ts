import "server-only";
import { promises as fs } from "fs";
import path from "path";

export type Preference = "one_time" | "annual" | "unsure";
export interface WaitlistEntry {
  email: string;
  preference: Preference;
  lang: string;
  source: string;
}

const DEV_FILE = path.join(process.cwd(), ".data", "waitlist.json");

/** Idempotent: a repeated email is silently ignored. Supabase when configured, local file in dev. */
export async function addToWaitlist(e: WaitlistEntry): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/waitlist?on_conflict=email`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify(e),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Supabase waitlist failed: ${res.status}`);
    return;
  }

  if (process.env.NODE_ENV === "production") throw new Error("Supabase is not configured");
  let db: WaitlistEntry[] = [];
  try {
    db = JSON.parse(await fs.readFile(DEV_FILE, "utf8"));
  } catch {}
  if (!db.some((x) => x.email === e.email)) db.push(e);
  await fs.mkdir(path.dirname(DEV_FILE), { recursive: true });
  await fs.writeFile(DEV_FILE, JSON.stringify(db, null, 2));
}
