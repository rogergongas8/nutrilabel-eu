"use client";

import React, { useState } from "react";
import { ShieldCheck, X } from "lucide-react";

type LegalDocKey = "terminos" | "exencion" | "privacidad" | null;

export const Footer: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<LegalDocKey>(null);

  return (
    <footer className="mt-16 bg-white border-t border-stone-200/80 py-12 text-stone-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Soft Collapsible FAQ Section */}
        <section id="preguntas-normativas" className="space-y-3">
          <h2 className="text-sm font-bold text-stone-800">
            Preguntas frecuentes sobre normativa (UE 1169/2011)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <details className="rounded-xl bg-stone-50/80 border border-stone-200/70 p-4">
              <summary className="font-semibold text-stone-800 cursor-pointer list-none flex items-center justify-between gap-2">
                <span>¿Es legal calcular la etiqueta sin laboratorio?</span>
                <span className="text-stone-400">+</span>
              </summary>
              <p className="mt-2 text-stone-500 leading-relaxed">
                Sí. El <strong>Artículo 31.4 del Reglamento (UE) Nº 1169/2011</strong> autoriza calcular los valores nutricionales a partir de bases de datos oficiales reconocidas (como <strong>BEDCA</strong> y <strong>USDA</strong>).
              </p>
            </details>

            <details className="rounded-xl bg-stone-50/80 border border-stone-200/70 p-4">
              <summary className="font-semibold text-stone-800 cursor-pointer list-none flex items-center justify-between gap-2">
                <span>¿Por qué se aplica la pérdida de agua al cocinar?</span>
                <span className="text-stone-400">+</span>
              </summary>
              <p className="mt-2 text-stone-500 leading-relaxed">
                Al hornear o cocer se evapora agua y los nutrientes se concentran por cada 100 g de producto terminado. Ajustar la merma asegura cumplir con las tolerancias de Sanidad.
              </p>
            </details>

            <details className="rounded-xl bg-stone-50/80 border border-stone-200/70 p-4">
              <summary className="font-semibold text-stone-800 cursor-pointer list-none flex items-center justify-between gap-2">
                <span>¿Qué exige la ley de etiquetas QR de Vinos?</span>
                <span className="text-stone-400">+</span>
              </summary>
              <p className="mt-2 text-stone-500 leading-relaxed">
                El Reglamento (UE) 2021/2117 exige mostrar la energía en botella y permite ofrecer los ingredientes y tabla nutricional mediante un QR sin cookies ni seguimiento.
              </p>
            </details>
          </div>
        </section>

        {/* Soft Legal Notice */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/60 text-[11px] text-stone-500 leading-relaxed flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p>
            <strong>Nota legal (Art. 31.4 Reglamento UE 1169/2011):</strong> NutriLabel realiza cálculos teóricos ponderados utilizando valores medios de bases de datos públicas oficiales (BEDCA y USDA). Conforme al Artículo 8 del Reglamento, el operador alimentario es responsable de verificar los pesos, mermas y alérgenos de sus proveedores.
          </p>
        </div>

        {/* Bottom Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400 pt-2">
          <p>© {new Date().getFullYear()} NutriLabel · Estación de Etiquetado Nutricional</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveDoc("terminos")}
              className="hover:text-stone-700 cursor-pointer"
            >
              Términos
            </button>
            <button
              type="button"
              onClick={() => setActiveDoc("exencion")}
              className="hover:text-stone-700 cursor-pointer"
            >
              Amparo Art. 31.4 UE
            </button>
            <button
              type="button"
              onClick={() => setActiveDoc("privacidad")}
              className="hover:text-stone-700 cursor-pointer"
            >
              Privacidad
            </button>
          </div>
        </div>
      </div>

      {activeDoc && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-stone-800 rounded-2xl border border-stone-200 max-w-lg w-full p-6 shadow-xl relative">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <h4 className="text-base font-bold text-stone-900">
                {activeDoc === "terminos" && "Términos de Uso"}
                {activeDoc === "exencion" && "Amparo Legal Art. 31.4 UE"}
                {activeDoc === "privacidad" && "Privacidad de tus Recetas"}
              </h4>
              <button
                type="button"
                onClick={() => setActiveDoc(null)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
              {activeDoc === "terminos" && (
                <p>
                  NutriLabel proporciona una calculadora basada en el Reglamento (UE) Nº 1169/2011. El operador alimentario debe contrastar que los ingredientes elegidos coincidan con las materias primas empleadas en su elaboración.
                </p>
              )}
              {activeDoc === "exencion" && (
                <p>
                  El Artículo 31.4 del Reglamento (UE) Nº 1169/2011 permite declarar valores nutricionales calculados a partir de bases de datos reconocidas (BEDCA / USDA), aplicando los márgenes de la Guía de Tolerancias de la Comisión Europea (±20%).
                </p>
              )}
              {activeDoc === "privacidad" && (
                <p>
                  Todas tus recetas y gramos se procesan localmente en tu propio navegador. Tus fórmulas nunca se envían a servidores externos.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
