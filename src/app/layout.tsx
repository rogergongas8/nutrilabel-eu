import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriLabel EU — Estación de Etiquetado Nutricional (UE 1169/2011 & Vinos 2021/2117)",
  description:
    "Calculadora técnica de información nutricional obligatoria por 100 g, detección de los 14 alérgenos (Anexo II) y generador de E-Labels QR para vinos sin cookies conforme al Reglamento (UE) 1169/2011 y (UE) 2021/2117.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased selection:bg-[#D94E28] selection:text-white">
        {children}
      </body>
    </html>
  );
}
