import { NextResponse } from "next/server";
import { getStore, tokenMatches } from "@/lib/elabel-store";
import { parseWineInput } from "@/lib/elabel-validate";

export const runtime = "nodejs";

/** Updates the wine data of an existing e-label. Requires the secret edit token. */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { wine?: unknown; editToken?: unknown };

  const store = getStore();
  const label = await store.get(id);
  if (!label || typeof body.editToken !== "string" || !tokenMatches(body.editToken, label.editTokenHash)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const parsed = parseWineInput(body.wine);
  if (!parsed.ok) return NextResponse.json({ error: `Invalid field: ${parsed.error}` }, { status: 400 });

  await store.updateWine(id, parsed.wine);
  return NextResponse.json({ ok: true });
}
