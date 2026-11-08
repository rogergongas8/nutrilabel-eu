import type { Metadata } from "next";
import { WineLanding } from "@/components/WineLanding";

export const metadata: Metadata = {
  title: { absolute: "Free Wine E-Label QR Generator (EU 2021/2117) | NutriLabel" },
  description:
    "Free wine e-label QR generator and energy per 100 ml calculator (EU 2021/2117), in 5 languages.",
  alternates: {
    canonical: "/wine-e-label",
    languages: { en: "/wine-e-label", es: "/es/etiqueta-electronica-vino" },
  },
};

export default function Page() {
  return <WineLanding lang="en" />;
}
