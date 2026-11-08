import { NextResponse } from "next/server";
import { getStore, tokenMatches } from "@/lib/elabel-store";
import { createCheckoutSession, stripeConfigured } from "@/lib/stripe";
import { siteOrigin } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { editToken } = (await req.json().catch(() => ({}))) as { editToken?: string };

  const label = await getStore().get(id);
  if (!label || typeof editToken !== "string" || !tokenMatches(editToken, label.editTokenHash)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const origin = siteOrigin(req);
  const doneUrl = `${origin}/e/${id}/done?t=${editToken}`;

  if (!stripeConfigured()) {
    // Local development without Stripe keys: skip payment through a dev-only endpoint.
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
    }
    return NextResponse.json({ url: `${origin}/api/dev/activate?id=${id}&t=${editToken}` });
  }

  const url = await createCheckoutSession({
    labelId: id,
    wineName: `${label.wine.wineName} ${label.wine.vintageYear}`,
    email: label.email,
    successUrl: doneUrl,
    cancelUrl: `${origin}/?cancelled=1`,
  });
  return NextResponse.json({ url });
}
