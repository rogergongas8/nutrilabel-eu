"use client";

import React from "react";
import { SEO_FOOD_TEMPLATES } from "@/data/seo-templates";

export const Footer: React.FC<{ lang?: "es" | "en" }> = ({ lang = "en" }) => {
  const isEn = lang === "en";

  return (
    <footer className="mt-16 bg-white border-t border-neutral-200/80 py-10 text-neutral-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Templates Directory */}
        <div>
          <p className="text-xs font-medium text-neutral-500 mb-2.5">
            {isEn
              ? "Popular Nutrition Label Templates:"
              : "Plantillas de etiquetas por producto:"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SEO_FOOD_TEMPLATES.map((tpl) => (
              <a
                key={tpl.slug}
                href={`/for/${tpl.slug}`}
                className="px-2.5 py-1 rounded-lg bg-neutral-50 border border-neutral-200/80 hover:border-neutral-400 text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {isEn ? tpl.navLabelEn : tpl.navLabelEs}
              </a>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400">
          <p>
            © {new Date().getFullYear()} NutriLabel ·{" "}
            {isEn
              ? "Compliant with EU Regulation 1169/2011 (Art. 31.4) & US FDA"
              : "Conforme al Reglamento (UE) 1169/2011 (Art. 31.4) y FDA"}
          </p>
          <span>100% Client-Side · USDA & BEDCA Databases</span>
        </div>
      </div>
    </footer>
  );
};
