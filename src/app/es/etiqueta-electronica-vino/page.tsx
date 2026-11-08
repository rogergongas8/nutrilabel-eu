import type { Metadata } from "next";
import { WineLanding } from "@/components/WineLanding";

export const metadata: Metadata = {
  title: "Etiqueta electrónica de vino con QR (UE 2021/2117) | NutriLabel",
  description:
    "Calcula la energía por 100 ml de tu vino y publica tu e-label con un QR permanente, en 5 idiomas.",
  alternates: {
    canonical: "/es/etiqueta-electronica-vino",
    languages: { en: "/wine-e-label", es: "/es/etiqueta-electronica-vino" },
  },
};

export default function Page() {
  return <WineLanding lang="es" />;
}
