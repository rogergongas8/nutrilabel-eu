import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

/** Price of one hosted e-label for one year, in euro cents. PLACEHOLDER: decide before launch. */
export const ELABEL_PRICE_CENTS = Number(process.env.ELABEL_PRICE_CENTS ?? 2900);
/** Payments are off until NEXT_PUBLIC_PAYMENTS_ENABLED=1 (the waitlist is shown instead). */
export const paymentsEnabled = () => process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "1";

export const stripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(opts: {
  labelId: string;
  wineName: string;
  email: string | null;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const body = new URLSearchParams({
    mode: "payment",
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    client_reference_id: opts.labelId,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "eur",
    "line_items[0][price_data][unit_amount]": String(ELABEL_PRICE_CENTS),
    "line_items[0][price_data][product_data][name]": `E-label alojada (pago único): ${opts.wineName}`,
  });
  if (opts.email) body.set("customer_email", opts.email);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) throw new Error(`Stripe error ${res.status}`);
  const json = (await res.json()) as { url?: string };
  if (!json.url) throw new Error("Stripe returned no checkout url");
  return json.url;
}

/** Verifies a Stripe-Signature header against the raw request body (5 min tolerance). */
export function verifyStripeSignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((kv) => {
      const i = kv.indexOf("=");
      return [kv.slice(0, i), kv.slice(i + 1)];
    })
  );
  const t = parts["t"];
  const v1 = header
    .split(",")
    .filter((kv) => kv.startsWith("v1="))
    .map((kv) => kv.slice(3));
  if (!t || v1.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;

  const expected = createHmac("sha256", secret).update(`${t}.${rawBody}`).digest();
  return v1.some((sig) => {
    const given = Buffer.from(sig, "hex");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}

