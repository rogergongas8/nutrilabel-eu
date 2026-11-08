import type { Metadata } from "next";
import { WineLanding } from "@/components/WineLanding";

export const metadata: Metadata = {
  title: { absolute: "Etiqueta electrónica de vino con QR gratis (UE 2021/2117) | NutriLabel" },
  description:
    "Generador gratuito de QR y calculadora de energía por 100 ml para la e-label de vino (UE 2021/2117), en 5 idiomas.",
  alternates: {
    canonical: "/es/etiqueta-electronica-vino",
    languages: { en: "/wine-e-label", es: "/es/etiqueta-electronica-vino" },
  },
};

export default function Page() {
  return <WineLanding lang="es" />;
}
