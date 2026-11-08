import type { Metadata } from "next";
import { WineLanding } from "@/components/WineLanding";

export const metadata: Metadata = {
  title: "Wine E-Label QR Generator (EU 2021/2117) | NutriLabel",
  description:
    "Calculate wine energy per 100 ml and publish your EU e-label page with a permanent QR code, in 5 languages.",
  alternates: {
    canonical: "/wine-e-label",
    languages: { en: "/wine-e-label", es: "/es/etiqueta-electronica-vino" },
  },
};

export default function Page() {
  return <WineLanding lang="en" />;
}
