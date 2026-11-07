import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nutrilabel-eu.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Generador de Etiquetas Nutricionales Gratis (UE 1169/2011 y QR Vinos) | NutriLabel EU",
    template: "%s | NutriLabel EU",
  },
  description:
    "Crea y descarga gratis tu etiqueta de información nutricional oficial (Reglamento UE 1169/2011 y FDA) en PNG 300 DPI o SVG vectorial. Calcula recetas con +158 ingredientes BEDCA/USDA, merma de cocción, los 14 alérgenos obligatorios y códigos QR E-Label sin cookies para vinos (UE 2021/2117).",
  keywords: [
    "generador etiquetas nutricionales gratis",
    "hacer etiqueta nutricional online",
    "calculadora información nutricional 100g",
    "etiquetado nutricional reglamento 1169/2011",
    "calcular valor nutricional de una receta",
    "etiqueta nutricional BEDCA",
    "generador QR vino reglamento 2021/2117",
    "e-label vino gratis sin cookies",
    "plantilla etiqueta nutricional imprenta svg png",
    "declaración de alérgenos obligatorios UE",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "NutriLabel EU",
    title:
      "Generador Gratuito de Etiquetas Nutricionales Oficiales (UE 1169/2011 y QR Vinos)",
    description:
      "Calcula tu etiqueta nutricional por 100g desde tu receta con datos oficiales BEDCA/USDA, merma de horneado, alérgenos en negrita y descarga en PNG 300 DPI o SVG vectorial gratis.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriLabel EU — Crea tu Etiqueta Nutricional Oficial Gratis",
    description:
      "Generador gratuito de tablas nutricionales (Reglamento UE 1169/2011) y etiquetas QR para vinos (UE 2021/2117) listo para imprenta.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "NutriLabel EU — Generador de Etiquetas Nutricionales y QR Vinos",
      url: siteUrl,
      applicationCategory: "BusinessApplication",
      operatingSystem: "All",
      inLanguage: "es-ES",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        description:
          "Generación y descarga 100% gratuita de etiquetas nutricionales en SVG vectorial, PNG 300 DPI y expediente sanitario APPCC.",
      },
      featureList: [
        "Cálculo nutricional ponderado por 100g y por ración según Art. 31.4 Reglamento (UE) 1169/2011",
        "Base de datos con 158+ ingredientes acreditados BEDCA y USDA más creador de ingredientes propios",
        "Ajuste físico de merma térmica por evaporación de humedad en horneado o cocción",
        "Detección y resaltado tipográfico automático de los 14 alérgenos obligatorios (Anexo II UE)",
        "Generador de E-Label QR para vinos sin cookies según Reglamento (UE) 2021/2117 en 5 idiomas",
        "Descarga directa en PNG 300 DPI, SVG vectorial para imprenta e Informe Técnico Sanidad",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Es legal calcular la etiqueta nutricional a partir de los ingredientes sin ir a un laboratorio?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. El Artículo 31.4 del Reglamento (UE) Nº 1169/2011 autoriza expresamente el cálculo de los valores nutricionales declarados a partir de los valores medios conocidos de los ingredientes utilizados o de datos generalmente establecidos y aceptados (como las bases de datos oficiales BEDCA en España y USDA).",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo afecta la merma de cocción o horneado a la tabla nutricional por 100 gramos?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Al hornear o cocer un alimento se evapora agua (merma hídrica), por lo que el peso final del lote disminuye y los nutrientes se concentran por cada 100 g de producto terminado. NutriLabel EU aplica automáticamente el factor de corrección por evaporación para cumplir con la Guía de Tolerancias (±20%) de la Comisión Europea.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué exige el Reglamento (UE) 2021/2117 para el código QR de los vinos?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Desde el 8 de diciembre de 2023, todos los vinos y productos vitivinícolas producidos en la UE deben declarar en la botella física el valor energético (símbolo E = kJ / kcal por 100 ml) y los alérgenos (como sulfitos), pudiendo ofrecer la tabla nutricional completa y la lista de ingredientes mediante un código QR (E-Label) cuya página de destino no contenga cookies de rastreo ni publicidad.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="antialiased selection:bg-[#D94E28] selection:text-white">
        {children}
      </body>
    </html>
  );
}
