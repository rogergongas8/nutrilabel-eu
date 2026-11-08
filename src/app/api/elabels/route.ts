import { NextResponse } from "next/server";
import { getStore, hashToken, newEditToken, newId } from "@/lib/elabel-store";
import { parseEmail, parseWineInput } from "@/lib/elabel-validate";

export const runtime = "nodejs";

/** Creates a pending (unpaid, not public) e-label. Returns its id and the secret edit token (shown once). */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { wine: rawWine, email: rawEmail } = (body ?? {}) as Record<string, unknown>;

  const parsed = parseWineInput(rawWine);
  if (!parsed.ok) return NextResponse.json({ error: `Invalid field: ${parsed.error}` }, { status: 400 });

  const email = parseEmail(rawEmail);
  if (!email) return NextResponse.json({ error: "Invalid field: email" }, { status: 400 });

  const id = newId();
  const editToken = newEditToken();
  await getStore().insert({
    id,
    status: "pending",
    editTokenHash: hashToken(editToken),
    email,
    wine: parsed.wine,
    createdAt: new Date().toISOString(),
    paidUntil: null,
    stripeSessionId: null,
  });

  return NextResponse.json({ id, editToken });
}
