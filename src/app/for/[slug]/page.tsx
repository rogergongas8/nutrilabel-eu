import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SEO_FOOD_TEMPLATES } from "@/data/seo-templates";
import { NutriLabelWorkspace } from "@/app/page";

export function generateStaticParams() {
  return SEO_FOOD_TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tpl = SEO_FOOD_TEMPLATES.find((t) => t.slug === slug);
  if (!tpl) return {};

  return {
    title: tpl.title,
    description: tpl.description,
    alternates: {
      canonical: `/for/${tpl.slug}`,
    },
    openGraph: {
      title: tpl.title,
      description: tpl.description,
      url: `/for/${tpl.slug}`,
      type: "website",
    },
  };
}

export default async function ProgrammaticSeoFoodPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tpl = SEO_FOOD_TEMPLATES.find((t) => t.slug === slug);

  if (!tpl) {
    notFound();
  }

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: tpl.faqQuestionEn,
        acceptedAnswer: {
          "@type": "Answer",
          text: tpl.faqAnswerEn,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <NutriLabelWorkspace initialTemplate={tpl} />
    </>
  );
}
