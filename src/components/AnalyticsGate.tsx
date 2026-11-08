"use client";

import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";

/** No analytics on the public e-label pages a bottle QR links to: the regulation forbids tracking consumers there. */
export function AnalyticsGate() {
  const path = usePathname() ?? "";
  if (path === "/elabel" || path.startsWith("/e/")) return null;
  return <Analytics />;
}
