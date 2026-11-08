/** Public origin used inside QR codes and Stripe redirects. Set NEXT_PUBLIC_SITE_URL in production. */
export function siteOrigin(req?: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  if (req) return new URL(req.url).origin;
  return "https://nutrilabel-eu.vercel.app";
}
