import { NextResponse } from "next/server";
import { getStore } from "@/lib/elabel-store";
import { verifyStripeSignature } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });

  const raw = await req.text(); // must be the untouched body for the signature to verify
  if (!verifyStripeSignature(raw, req.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  const event = JSON.parse(raw) as {
    type: string;
    data: { object: { id: string; client_reference_id?: string; payment_status?: string } };
  };

  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
    if (s.client_reference_id && s.payment_status === "paid") {
      await getStore().activate(s.client_reference_id, null, s.id);
    }
  }
  return NextResponse.json({ received: true });
}
