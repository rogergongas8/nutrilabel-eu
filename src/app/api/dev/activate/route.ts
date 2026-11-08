import { NextResponse } from "next/server";
import { getStore, tokenMatches } from "@/lib/elabel-store";
import { paidUntilFromNow } from "@/lib/stripe";

export const runtime = "nodejs";

/** DEV ONLY: marks an e-label as paid without Stripe. Hard-disabled in production. */
export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production") return new NextResponse("Not found", { status: 404 });

  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";
  const t = url.searchParams.get("t") ?? "";
  const store = getStore();
  const label = await store.get(id);
  if (!label || !tokenMatches(t, label.editTokenHash)) return new NextResponse("Not found", { status: 404 });

  await store.activate(id, paidUntilFromNow(), "dev");
  return NextResponse.redirect(`${url.origin}/e/${id}/done?t=${t}`);
}
