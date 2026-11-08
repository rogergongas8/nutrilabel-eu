import { NextResponse } from "next/server";
import { addToWaitlist, type Preference } from "@/lib/waitlist-store";
import { parseEmail } from "@/lib/elabel-validate";

export const runtime = "nodejs";

const PREFS: Preference[] = ["one_time", "annual", "unsure"];

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  // Honeypot: real users never fill this hidden field. Pretend success to bots.
  if (typeof b.website === "string" && b.website.length > 0) return NextResponse.json({ ok: true });

  const email = parseEmail(b.email);
  const preference = PREFS.find((p) => p === b.preference);
  if (!email || !preference) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  await addToWaitlist({
    email: email.toLowerCase(),
    preference,
    lang: b.lang === "es" ? "es" : "en",
    source: typeof b.source === "string" ? b.source.slice(0, 40) : "unknown",
  });
  return NextResponse.json({ ok: true });
}
