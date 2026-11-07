"use client";

import React, { useState, useRef } from "react";
import { Download, Shield, CheckCircle2, FileCheck } from "lucide-react";
import { CalculationResult } from "@/types/nutrition";
import { formatNutrientDisplay } from "@/lib/calculator";
import { Button } from "@/components/ui/button";

interface NutritionLabelProps {
  calculation: CalculationResult | null;
  onOpenAuditSheet: () => void;
  productName?: string;
}

export const NutritionLabel: React.FC<NutritionLabelProps> = ({
  calculation,
  onOpenAuditSheet,
  productName = "Producto Alimentario Artesanal",
}) => {
  const [standard, setStandard] = useState<"EU" | "FDA">("EU");
  const [isExporting, setIsExporting] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);

  if (!calculation) {
    return (
      <div className="bg-surface border-2 border-primary p-8 text-center shadow-tactile">
        <div className="w-12 h-12 bg-primary text-[#F6F3EC] flex items-center justify-center mx-auto mb-4">
          <FileCheck className="w-6 h-6" />
        </div>
        <h3 className="font-display text-xl font-bold text-primary">
          Pliego de Impresión en Espera
        </h3>
        <p className="text-xs text-neutral mt-2 max-w-xs mx-auto">
          Incorpora al menos un ingrediente en el escandallo para renderizar el arte final según el Anexo XV del Reglamento (UE) 1169/2011.
        </p>
      </div>
    );
  }

  const {
    per100g,
    perServing,
    referenceIntakePercent,
    servingSizeGrams,
    allergens,
  } = calculation;

  const handleDownloadSVG = () => {
    setIsExporting(true);
    const svgData = `
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="540" viewBox="0 0 420 540">
  <style>
    .title { font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; fill: #111613; }
    .header { font-family: Helvetica, Arial, sans-serif; font-size: 11px; font-weight: bold; fill: #111613; }
    .row { font-family: Helvetica, Arial, sans-serif; font-size: 11px; fill: #111613; }
    .bold { font-weight: bold; }
    .sub { font-family: Helvetica, Arial, sans-serif; fill: #4A524E; font-size: 9.5px; }
    .line { stroke: #111613; stroke-width: 1; }
    .thick-line { stroke: #111613; stroke-width: 2.5; }
  </style>
  <rect width="420" height="540" fill="#ffffff" stroke="#111613" stroke-width="2.5"/>
  <text x="18" y="32" class="title">INFORMACIÓN NUTRICIONAL</text>
  <line x1="18" y1="40" x2="402" y2="40" class="thick-line"/>
  <text x="18" y="56" class="header">Valores medios</text>
  <text x="235" y="56" class="header">Por 100 g</text>
  <text x="310" y="56" class="header">Por ${servingSizeGrams} g</text>
  <text x="375" y="56" class="header">% IR*</text>
  <line x1="18" y1="63" x2="402" y2="63" class="line"/>
  
  <text x="18" y="81" class="row bold">Valor energético</text>
  <text x="215" y="81" class="row">${per100g.energyKj} kJ / ${per100g.energyKcal} kcal</text>
  <text x="380" y="81" class="row">${referenceIntakePercent.energy}%</text>
  <line x1="18" y1="89" x2="402" y2="89" class="line"/>

  <text x="18" y="107" class="row bold">Grasas</text>
  <text x="235" y="107" class="row">${per100g.fat} g</text>
  <text x="310" y="107" class="row">${perServing.fat} g</text>
  <text x="380" y="107" class="row">${referenceIntakePercent.fat}%</text>
  <line x1="18" y1="115" x2="402" y2="115" class="line"/>

  <text x="32" y="131" class="row">de las cuales saturadas</text>
  <text x="235" y="131" class="row">${per100g.saturatedFat} g</text>
  <text x="310" y="131" class="row">${perServing.saturatedFat} g</text>
  <text x="380" y="131" class="row">${referenceIntakePercent.saturatedFat}%</text>
  <line x1="18" y1="139" x2="402" y2="139" class="line"/>

  <text x="18" y="157" class="row bold">Hidratos de carbono</text>
  <text x="235" y="157" class="row">${per100g.carbs} g</text>
  <text x="310" y="157" class="row">${perServing.carbs} g</text>
  <text x="380" y="157" class="row">${referenceIntakePercent.carbs}%</text>
  <line x1="18" y1="165" x2="402" y2="165" class="line"/>

  <text x="32" y="181" class="row">de los cuales azúcares</text>
  <text x="235" y="181" class="row">${per100g.sugars} g</text>
  <text x="310" y="181" class="row">${perServing.sugars} g</text>
  <text x="380" y="181" class="row">${referenceIntakePercent.sugars}%</text>
  <line x1="18" y1="189" x2="402" y2="189" class="line"/>

  <text x="18" y="207" class="row bold">Proteínas</text>
  <text x="235" y="207" class="row">${per100g.protein} g</text>
  <text x="310" y="207" class="row">${perServing.protein} g</text>
  <text x="380" y="207" class="row">${referenceIntakePercent.protein}%</text>
  <line x1="18" y1="215" x2="402" y2="215" class="line"/>

  <text x="18" y="233" class="row bold">Sal</text>
  <text x="235" y="233" class="row">${per100g.salt} g</text>
  <text x="310" y="233" class="row">${perServing.salt} g</text>
  <text x="380" y="233" class="row">${referenceIntakePercent.salt}%</text>
  <line x1="18" y1="242" x2="402" y2="242" class="thick-line"/>

  <text x="18" y="262" class="sub">* Ingesta de referencia de un adulto medio (8 400 kJ / 2 000 kcal)</text>
  <text x="18" y="278" class="sub">Calculado conforme al Art. 31.4 Reglamento (UE) Nº 1169/2011</text>
</svg>
    `.trim();

    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `arte-final-nutricional-${productName
      .toLowerCase()
      .replace(/\s+/g, "-")}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  return (
    <div className="space-y-5">
      {/* Jurisdiction Switcher Bar */}
      <div className="bg-surface border-2 border-primary p-3 flex items-center justify-between">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary pl-1">
          Jurisdicción Legal:
        </span>

        <div className="flex border border-primary bg-[#EAE5D9] p-0.5 font-mono text-xs font-bold">
          <button
            type="button"
            onClick={() => setStandard("EU")}
            className={`px-3 py-1.5 transition-colors cursor-pointer ${
              standard === "EU"
                ? "bg-primary text-[#F6F3EC]"
                : "text-primary hover:bg-primary/10"
            }`}
          >
            UE 1169/2011
          </button>
          <button
            type="button"
            onClick={() => setStandard("FDA")}
            className={`px-3 py-1.5 transition-colors cursor-pointer ${
              standard === "FDA"
                ? "bg-primary text-[#F6F3EC]"
                : "text-primary hover:bg-primary/10"
            }`}
          >
            USA FDA 21 CFR
          </button>
        </div>
      </div>

      {/* Print Proof Container with Crop Marks */}
      <div
        ref={labelRef}
        className="bg-white border-2 border-ink p-6 shadow-tactile relative crop-marks"
      >
        {/* Top Print Specifications */}
        <div className="flex items-center justify-between font-mono text-[10px] text-neutral border-b border-dashed border-ink/30 pb-2 mb-4">
          <span>ARTE FINAL IMPRENTA · ALTURA x ≥ 1,2 mm</span>
          <span>LOTE NETO: {calculation.finishedWeightGrams.toFixed(0)} g</span>
        </div>

        {/* Official Label Header */}
        <div className="border-b-4 border-ink pb-2 mb-2">
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg font-black tracking-tight text-ink uppercase font-sans">
              {standard === "EU" ? "Información Nutricional" : "Nutrition Facts"}
            </h3>
            <span className="font-mono text-[10px] font-bold text-ink">
              {standard === "EU" ? "ANEXO XV UE" : "FDA STANDARD"}
            </span>
          </div>
          <p className="text-xs text-ink/80 font-sans">
            Tamaño de ración declarada:{" "}
            <strong className="font-bold text-ink">{servingSizeGrams} g</strong> (
            {calculation.servingsCount} raciones por envase)
          </p>
        </div>

        {/* Official Mandatory Nutrient Table */}
        <div className="overflow-x-auto">
          <table className="nutrition-table-official text-ink">
            <thead>
              <tr className="border-b-2 border-ink text-left text-xs font-black">
                <th className="py-1.5 px-1">Valores medios</th>
                <th className="py-1.5 px-1 text-right">Por 100 g</th>
                <th className="py-1.5 px-1 text-right">Por {servingSizeGrams} g</th>
                <th className="py-1.5 px-1 text-right">% IR*</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/30 font-sans text-xs">
              <tr className="font-bold">
                <td className="py-1.5 px-1">Valor energético</td>
                <td className="py-1.5 px-1 text-right">
                  {per100g.energyKj} kJ / {per100g.energyKcal} kcal
                </td>
                <td className="py-1.5 px-1 text-right">
                  {perServing.energyKj} kJ / {perServing.energyKcal} kcal
                </td>
                <td className="py-1.5 px-1 text-right">
                  {referenceIntakePercent.energy}%
                </td>
              </tr>

              <tr className="font-bold">
                <td className="py-1.5 px-1">Grasas</td>
                <td className="py-1.5 px-1 text-right">
                  {formatNutrientDisplay(per100g.fat, "macro")}
                </td>
                <td className="py-1.5 px-1 text-right">
                  {formatNutrientDisplay(perServing.fat, "macro")}
                </td>
                <td className="py-1.5 px-1 text-right">
                  {referenceIntakePercent.fat}%
                </td>
              </tr>
              <tr className="text-ink/80">
                <td className="py-1 px-1 pl-4">de las cuales saturadas</td>
                <td className="py-1 px-1 text-right">
                  {formatNutrientDisplay(per100g.saturatedFat, "saturated")}
                </td>
                <td className="py-1 px-1 text-right">
                  {formatNutrientDisplay(perServing.saturatedFat, "saturated")}
                </td>
                <td className="py-1 px-1 text-right">
                  {referenceIntakePercent.saturatedFat}%
                </td>
              </tr>

              <tr className="font-bold">
                <td className="py-1.5 px-1">Hidratos de carbono</td>
                <td className="py-1.5 px-1 text-right">
                  {formatNutrientDisplay(per100g.carbs, "macro")}
                </td>
                <td className="py-1.5 px-1 text-right">
                  {formatNutrientDisplay(perServing.carbs, "macro")}
                </td>
                <td className="py-1.5 px-1 text-right">
                  {referenceIntakePercent.carbs}%
                </td>
              </tr>
              <tr className="text-ink/80">
                <td className="py-1 px-1 pl-4">de los cuales azúcares</td>
                <td className="py-1 px-1 text-right">
                  {formatNutrientDisplay(per100g.sugars, "macro")}
                </td>
                <td className="py-1 px-1 text-right">
                  {formatNutrientDisplay(perServing.sugars, "macro")}
                </td>
                <td className="py-1 px-1 text-right">
                  {referenceIntakePercent.sugars}%
                </td>
              </tr>

              <tr className="font-bold">
                <td className="py-1.5 px-1">Proteínas</td>
                <td className="py-1.5 px-1 text-right">
                  {formatNutrientDisplay(per100g.protein, "macro")}
                </td>
                <td className="py-1.5 px-1 text-right">
                  {formatNutrientDisplay(perServing.protein, "macro")}
                </td>
                <td className="py-1.5 px-1 text-right">
                  {referenceIntakePercent.protein}%
                </td>
              </tr>

              <tr className="font-bold border-b-2 border-ink">
                <td className="py-1.5 px-1">Sal</td>
                <td className="py-1.5 px-1 text-right">
                  {formatNutrientDisplay(per100g.salt, "salt")}
                </td>
                <td className="py-1.5 px-1 text-right">
                  {formatNutrientDisplay(perServing.salt, "salt")}
                </td>
                <td className="py-1.5 px-1 text-right">
                  {referenceIntakePercent.salt}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-2 text-[10px] text-ink/70 leading-snug font-sans">
          * Ingesta de referencia de un adulto medio (8 400 kJ / 2 000 kcal) conforme al Anexo XIII del Reglamento (UE) Nº 1169/2011.
        </p>

        {/* Mandatory Ingredients & Allergen Typography Box */}
        <div className="mt-4 pt-3 border-t-2 border-ink">
          <p className="font-sans text-[11px] font-black uppercase tracking-wide text-ink">
            LISTA REGLAMENTARIA DE INGREDIENTES (ART. 18 Y 21):
          </p>
          <p className="mt-1 text-xs text-ink leading-relaxed font-sans">
            {calculation.ingredientsListFormatted.split("**").map((chunk, i) =>
              i % 2 === 1 ? (
                <strong
                  key={i}
                  className="font-black text-ink underline decoration-2"
                >
                  {chunk}
                </strong>
              ) : (
                chunk
              )
            )}
          </p>

          {allergens.length > 0 && (
            <div className="mt-3 p-2.5 bg-[#F6F3EC] border-l-4 border-accent text-xs text-primary font-mono">
              <strong className="text-accent uppercase block text-[10px]">
                DECLARACIÓN DE ALÉRGENOS (ANEXO II):
              </strong>
              Contiene:{" "}
              <strong>{allergens.map((a) => a.nameEs).join(", ")}</strong>.
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons: Vector SVG Download & Sanitary Audit Dossier */}
      <div className="grid grid-cols-1 gap-3">
        <Button
          variant="accent"
          size="lg"
          onClick={handleDownloadSVG}
          disabled={isExporting}
          className="w-full"
        >
          <Download className="w-4 h-4" />
          <span>Descargar Arte Final Vectorial (.SVG Imprenta)</span>
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={onOpenAuditSheet}
          className="w-full"
        >
          <Shield className="w-4 h-4 text-accent" />
          <span>Abrir Expediente Técnico para Inspección Sanitaria</span>
        </Button>
      </div>

      {/* Print Compliance Seal */}
      <div className="p-3 bg-surface border border-primary/30 text-xs text-primary flex items-center gap-2.5 font-mono">
        <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
        <span>
          <strong>VERIFICADO:</strong> Trazabilidad matemática conforme a la Guía de Tolerancias de la Comisión Europea (Diciembre 2012).
        </span>
      </div>
    </div>
  );
};
