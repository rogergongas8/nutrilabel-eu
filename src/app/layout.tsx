import type { Metadata } from "next";
import { AnalyticsGate } from "@/components/AnalyticsGate";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nutrilabel-eu.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Google Search Console ownership verification (public by design).
  verification: { google: "VWpNldQctWiAcf-7JBA--Nju78anincaBX9p5FKMH2Q" },
  title: {
    default:
      "Free EU & UK Nutrition Label Generator (1169/2011) & Wine QR E-Label | Generador Etiquetas Nutricionales | NutriLabel",
    template: "%s | NutriLabel EU",
  },
  description:
    "100% Free EU/UK Regulation 1169/2011 & US FDA Nutrition Label Generator + EU Wine QR E-Label Studio (2021/2117). Crea y descarga gratis tu etiqueta nutricional oficial por 100g con +158 ingredientes BEDCA/USDA, merma de cocción y los 14 alérgenos en PNG 300 DPI o SVG vectorial.",
  keywords: [
    "free EU nutrition label generator",
    "UK nutrition declaration generator per 100g",
    "EU regulation 1169/2011 nutrition calculator",
    "free EU wine QR code e-label generator 2021/2117",
    "generador etiquetas nutricionales gratis",
    "hacer etiqueta nutricional online",
    "calculadora información nutricional 100g",
    "etiquetado nutricional reglamento 1169/2011",
    "calcular valor nutricional de una receta",
    "etiqueta nutricional BEDCA",
    "generador QR vino reglamento 2021/2117",
    "e-label vino gratis sin cookies",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["en_GB", "es_ES"],
    url: siteUrl,
    siteName: "NutriLabel EU",
    title:
      "Free EU/UK Nutrition Label Generator (1169/2011) & Wine QR E-Label Studio",
    description:
      "Calculate your official per-100g nutrition table from your recipe using BEDCA & USDA data, baking moisture loss, bold EU allergens, and export 300 DPI PNG or vector SVG for free.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriLabel EU — Free EU/UK Nutrition Label & Wine QR Generator",
    description:
      "Free print-ready nutrition labels (EU 1169/2011 & FDA) and cookie-free Wine E-Label QR codes (EU 2021/2117).",
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
      name: "NutriLabel EU — Free EU/UK Nutrition Label & Wine QR E-Label Generator",
      url: siteUrl,
      applicationCategory: "BusinessApplication",
      operatingSystem: "All",
      inLanguage: ["es", "en"],
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        description:
          "100% Free generation and download of EU 1169/2011 & FDA nutrition labels in vector SVG, 300 DPI PNG, and HACCP audit dossier.",
      },
      featureList: [
        "Weighted nutrition calculation per 100g and per serving under Art. 31.4 Regulation (EU) 1169/2011",
        "158+ verified BEDCA & USDA ingredients in English and Spanish plus custom supplier ingredient builder",
        "Thermal cooking/baking moisture loss (%) adjustment",
        "Automatic detection and bold typography formatting of the 14 mandatory EU allergens (Annex II)",
        "Cookie-free EU Wine E-Label QR Code Generator under Regulation (EU) 2021/2117 in 5 languages (ES, EN, FR, DE, IT)",
        "Instant download in 300 DPI PNG, print-ready vector SVG, and HACCP inspection report",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is it legal to calculate an EU/UK nutrition label from recipe ingredients without lab testing?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Article 31(4) of Regulation (EU) No 1169/2011 explicitly authorizes calculating declared nutrition values from known average values of the ingredients used or from generally established and accepted public food composition databases (such as USDA FoodData Central and BEDCA).",
          },
        },
        {
          "@type": "Question",
          name: "¿Es legal calcular la etiqueta nutricional a partir de los ingredientes sin ir a un laboratorio?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. El Artículo 31.4 del Reglamento (UE) Nº 1169/2011 autoriza expresamente el cálculo de los valores nutricionales declarados a partir de los valores medios conocidos de los ingredientes utilizados o de bases de datos oficiales (BEDCA y USDA).",
          },
        },
        {
          "@type": "Question",
          name: "What does EU Regulation 2021/2117 require for Wine QR code E-Labels?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "All wines sold in the European Union must print the energy value (E = kJ / kcal per 100 ml) and allergens (such as sulphites) on the physical bottle, while providing the full nutrition declaration and ingredient list via a QR code (E-Label) hosted on a page completely free of tracking cookies and marketing scripts.",
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
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="antialiased selection:bg-[#D94E28] selection:text-white">
        {children}
      <AnalyticsGate />
        </body>
    </html>
  );
}
