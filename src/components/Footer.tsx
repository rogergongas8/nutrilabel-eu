"use client";

import React, { useState } from "react";
import { ShieldCheck, X } from "lucide-react";

type LegalDocKey = "terminos" | "exencion" | "privacidad" | null;

export const Footer: React.FC<{ lang?: "es" | "en" }> = ({ lang = "en" }) => {
  const [activeDoc, setActiveDoc] = useState<LegalDocKey>(null);
  const isEn = lang === "en";

  return (
    <footer className="mt-16 bg-[#FAF7F2] border-t border-[#E2D9C8] py-12 text-[#5C534C]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Warm Collapsible FAQ Section */}
        <section id="preguntas-normativas" className="space-y-3">
          <h2 className="font-serif text-base font-semibold text-[#231F1D]">
            {isEn
              ? "Frequently Asked Questions (EU Regulation 1169/2011 & FDA)"
              : "Preguntas frecuentes sobre normativa (UE 1169/2011)"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <details className="rounded-xl bg-white border border-[#DCD2C0] p-4">
              <summary className="font-semibold text-[#231F1D] cursor-pointer list-none flex items-center justify-between gap-2">
                <span>
                  {isEn
                    ? "Is it legal to calculate a label without lab testing?"
                    : "¿Es legal calcular la etiqueta sin laboratorio?"}
                </span>
                <span className="text-[#8C827A]">+</span>
              </summary>
              <p className="mt-2 text-[#6E655F] leading-relaxed">
                {isEn ? (
                  <>
                    Yes. <strong>Article 31(4) of Regulation (EU) No 1169/2011</strong> explicitly authorizes calculating declared nutrition values from recognized public food composition databases (such as <strong>USDA</strong> and <strong>BEDCA</strong>).
                  </>
                ) : (
                  <>
                    Sí. El <strong>Artículo 31.4 del Reglamento (UE) Nº 1169/2011</strong> autoriza calcular los valores nutricionales a partir de bases de datos oficiales reconocidas (como <strong>BEDCA</strong> y <strong>USDA</strong>).
                  </>
                )}
              </p>
            </details>

            <details className="rounded-xl bg-white border border-[#DCD2C0] p-4">
              <summary className="font-semibold text-[#231F1D] cursor-pointer list-none flex items-center justify-between gap-2">
                <span>
                  {isEn
                    ? "Why adjust for water loss in cooking or baking?"
                    : "¿Por qué se aplica la pérdida de agua al cocinar?"}
                </span>
                <span className="text-[#8C827A]">+</span>
              </summary>
              <p className="mt-2 text-[#6E655F] leading-relaxed">
                {isEn
                  ? "When baking or simmering, water evaporates and nutrients concentrate per 100 g of finished product. Adjusting moisture loss ensures compliance with official inspection tolerances."
                  : "Al hornear o cocer se evapora agua y los nutrientes se concentran por cada 100 g de producto terminado. Ajustar la merma asegura cumplir con las tolerancias de Sanidad."}
              </p>
            </details>

            <details className="rounded-xl bg-white border border-[#DCD2C0] p-4">
              <summary className="font-semibold text-[#231F1D] cursor-pointer list-none flex items-center justify-between gap-2">
                <span>
                  {isEn
                    ? "What does the EU Wine QR E-Label law require?"
                    : "¿Qué exige la ley de etiquetas QR de Vinos?"}
                </span>
                <span className="text-[#8C827A]">+</span>
              </summary>
              <p className="mt-2 text-[#6E655F] leading-relaxed">
                {isEn
                  ? "Regulation (EU) 2021/2117 requires printing energy (E) and allergens on the bottle while providing the full ingredient list and nutrition table via a cookie-free QR code."
                  : "El Reglamento (UE) 2021/2117 exige mostrar la energía en botella y permite ofrecer los ingredientes y tabla nutricional mediante un QR sin cookies ni seguimiento."}
              </p>
            </details>
          </div>
        </section>

        {/* Warm Legal Notice */}
        <div className="p-4 rounded-xl bg-[#F4EFE6] border border-[#DCD2C0] text-[11px] text-[#6E655F] leading-relaxed flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#4A5D4E] shrink-0 mt-0.5" />
          <p>
            {isEn ? (
              <>
                <strong>Legal Notice (Art. 31.4 EU Regulation 1169/2011):</strong> NutriLabel performs weighted calculations using average values from official public databases (USDA & BEDCA). Under Article 8 of the Regulation, the food business operator is responsible for verifying weights, cooking yields, and supplier allergen declarations.
              </>
            ) : (
              <>
                <strong>Nota legal (Art. 31.4 Reglamento UE 1169/2011):</strong> NutriLabel realiza cálculos teóricos ponderados utilizando valores medios de bases de datos públicas oficiales (BEDCA y USDA). Conforme al Artículo 8 del Reglamento, el operador alimentario es responsable de verificar los pesos, mermas y alérgenos de sus proveedores.
              </>
            )}
          </p>
        </div>

        {/* Bottom Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#8C827A] pt-2">
          <p>
            © {new Date().getFullYear()} NutriLabel ·{" "}
            {isEn
              ? "Official Nutrition Labeling Studio"
              : "Estudio de Etiquetado Nutricional"}
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveDoc("terminos")}
              className="hover:text-[#231F1D] cursor-pointer"
            >
              {isEn ? "Terms" : "Términos"}
            </button>
            <button
              type="button"
              onClick={() => setActiveDoc("exencion")}
              className="hover:text-[#231F1D] cursor-pointer"
            >
              {isEn ? "EU Art. 31.4 Basis" : "Amparo Art. 31.4 UE"}
            </button>
            <button
              type="button"
              onClick={() => setActiveDoc("privacidad")}
              className="hover:text-[#231F1D] cursor-pointer"
            >
              {isEn ? "Privacy" : "Privacidad"}
            </button>
          </div>
        </div>
      </div>

      {activeDoc && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] text-[#231F1D] rounded-2xl border border-[#DCD2C0] max-w-lg w-full p-6 shadow-xl relative">
            <div className="flex items-center justify-between border-b border-[#E5DEC9] pb-3 mb-4">
              <h4 className="font-serif text-base font-bold text-[#231F1D]">
                {activeDoc === "terminos" && (isEn ? "Terms of Use" : "Términos de Uso")}
                {activeDoc === "exencion" &&
                  (isEn ? "EU Article 31.4 Legal Basis" : "Amparo Legal Art. 31.4 UE")}
                {activeDoc === "privacidad" &&
                  (isEn ? "Recipe Privacy" : "Privacidad de tus Recetas")}
              </h4>
              <button
                type="button"
                onClick={() => setActiveDoc(null)}
                className="p-1 text-[#8C827A] hover:text-[#231F1D] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-[#5C534C] leading-relaxed">
              {activeDoc === "terminos" && (
                <p>
                  {isEn
                    ? "NutriLabel provides a nutrition calculator based on Regulation (EU) No 1169/2011 and US FDA guidelines. Food business operators should verify that selected ingredients match their raw materials."
                    : "NutriLabel proporciona una calculadora basada en el Reglamento (UE) Nº 1169/2011. El operador alimentario debe contrastar que los ingredientes elegidos coincidan con las materias primas empleadas en su elaboración."}
                </p>
              )}
              {activeDoc === "exencion" && (
                <p>
                  {isEn
                    ? "Article 31(4) of Regulation (EU) No 1169/2011 authorizes declaring nutrition values calculated from recognized public databases (USDA / BEDCA) within European Commission tolerance guidelines (±20%)."
                    : "El Artículo 31.4 del Reglamento (UE) Nº 1169/2011 permite declarar valores nutricionales calculados a partir de bases de datos reconocidas (BEDCA / USDA), aplicando los márgenes de la Guía de Tolerancias de la Comisión Europea (±20%)."}
                </p>
              )}
              {activeDoc === "privacidad" && (
                <p>
                  {isEn
                    ? "All your recipes and ingredient weights are processed locally in your browser. Your formulas are never sent to external servers."
                    : "Todas tus recetas y gramos se procesan localmente en tu propio navegador. Tus fórmulas nunca se envían a servidores externos."}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
