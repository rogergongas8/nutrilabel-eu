"use client";

import React, { useState, useRef } from "react";
import { Download, FileCheck, Image as ImageIcon } from "lucide-react";
import { CalculationResult } from "@/types/nutrition";
import { formatNutrientDisplay } from "@/lib/calculator";

interface NutritionLabelProps {
  calculation: CalculationResult | null;
  onOpenAuditSheet: () => void;
  productName?: string;
  lang?: "es" | "en";
}

export const NutritionLabel: React.FC<NutritionLabelProps> = ({
  calculation,
  productName = "Producto Alimentario Artesanal",
  lang = "es",
}) => {
  const [standard, setStandard] = useState<"EU" | "FDA">("EU");
  const [isExporting, setIsExporting] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);

  const isEn = lang === "en" || standard === "FDA";

  if (!calculation) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-10 text-center">
        <div className="w-11 h-11 rounded-xl bg-stone-100 text-stone-500 flex items-center justify-center mx-auto mb-3">
          <FileCheck className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-stone-800">
          {lang === "en" ? "Your label will appear here" : "Tu etiqueta aparecerá aquí"}
        </h3>
        <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
          {lang === "en"
            ? "Add at least one ingredient on the left to generate your nutrition label."
            : "Añade al menos un ingrediente a la izquierda para generar la tabla nutricional."}
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

  const buildLabelSVGString = () => {
    const title = isEn
      ? standard === "FDA"
        ? "NUTRITION FACTS"
        : "NUTRITION DECLARATION"
      : "INFORMACIÓN NUTRICIONAL";
    const col1 = isEn ? "Typical values" : "Valores medios";
    const col2 = isEn ? "Per 100 g" : "Por 100 g";
    const col3 = isEn ? `Per ${servingSizeGrams} g` : `Por ${servingSizeGrams} g`;
    const col4 = isEn ? "% RI*" : "% IR*";

    const rowEnergy = isEn ? "Energy" : "Valor energético";
    const rowFat = isEn ? "Fat" : "Grasas";
    const rowSat = isEn ? "of which saturates" : "de las cuales saturadas";
    const rowCarbs = isEn ? "Carbohydrate" : "Hidratos de carbono";
    const rowSugars = isEn ? "of which sugars" : "de los cuales azúcares";
    const rowProtein = isEn ? "Protein" : "Proteínas";
    const rowSalt = isEn ? "Salt" : "Sal";

    const footer1 = isEn
      ? "* Reference intake of an average adult (8 400 kJ / 2 000 kcal)"
      : "* Ingesta de referencia de un adulto medio (8 400 kJ / 2 000 kcal)";
    const footer2 = isEn
      ? "Calculated per Art. 31.4 Regulation (EU) No 1169/2011"
      : "Calculado conforme al Art. 31.4 Reglamento (UE) Nº 1169/2011";

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="440" height="310" viewBox="0 0 440 310">
  <style>
    .title { font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; fill: #111613; }
    .header { font-family: Helvetica, Arial, sans-serif; font-size: 11px; font-weight: bold; fill: #111613; }
    .row { font-family: Helvetica, Arial, sans-serif; font-size: 11px; fill: #111613; }
    .bold { font-weight: bold; }
    .sub { font-family: Helvetica, Arial, sans-serif; fill: #4A524E; font-size: 9.5px; }
    .line { stroke: #111613; stroke-width: 1; }
    .thick-line { stroke: #111613; stroke-width: 2.5; }
  </style>
  <rect width="440" height="310" fill="#ffffff" stroke="#111613" stroke-width="2.5"/>
  <text x="18" y="30" class="title">${title}</text>
  <line x1="18" y1="38" x2="422" y2="38" class="thick-line"/>
  <text x="18" y="54" class="header">${col1}</text>
  <text x="235" y="54" class="header">${col2}</text>
  <text x="315" y="54" class="header">${col3}</text>
  <text x="385" y="54" class="header">${col4}</text>
  <line x1="18" y1="61" x2="422" y2="61" class="line"/>
  
  <text x="18" y="79" class="row bold">${rowEnergy}</text>
  <text x="200" y="79" class="row">${per100g.energyKj} kJ / ${per100g.energyKcal} kcal</text>
  <text x="315" y="79" class="row">${perServing.energyKcal} kcal</text>
  <text x="390" y="79" class="row">${referenceIntakePercent.energy}%</text>
  <line x1="18" y1="87" x2="422" y2="87" class="line"/>

  <text x="18" y="105" class="row bold">${rowFat}</text>
  <text x="235" y="105" class="row">${per100g.fat} g</text>
  <text x="315" y="105" class="row">${perServing.fat} g</text>
  <text x="390" y="105" class="row">${referenceIntakePercent.fat}%</text>
  <line x1="18" y1="113" x2="422" y2="113" class="line"/>

  <text x="32" y="129" class="row">${rowSat}</text>
  <text x="235" y="129" class="row">${per100g.saturatedFat} g</text>
  <text x="315" y="129" class="row">${perServing.saturatedFat} g</text>
  <text x="390" y="129" class="row">${referenceIntakePercent.saturatedFat}%</text>
  <line x1="18" y1="137" x2="422" y2="137" class="line"/>

  <text x="18" y="155" class="row bold">${rowCarbs}</text>
  <text x="235" y="155" class="row">${per100g.carbs} g</text>
  <text x="315" y="155" class="row">${perServing.carbs} g</text>
  <text x="390" y="155" class="row">${referenceIntakePercent.carbs}%</text>
  <line x1="18" y1="163" x2="422" y2="163" class="line"/>

  <text x="32" y="179" class="row">${rowSugars}</text>
  <text x="235" y="179" class="row">${per100g.sugars} g</text>
  <text x="315" y="179" class="row">${perServing.sugars} g</text>
  <text x="390" y="179" class="row">${referenceIntakePercent.sugars}%</text>
  <line x1="18" y1="187" x2="422" y2="187" class="line"/>

  <text x="18" y="205" class="row bold">${rowProtein}</text>
  <text x="235" y="205" class="row">${per100g.protein} g</text>
  <text x="315" y="205" class="row">${perServing.protein} g</text>
  <text x="390" y="205" class="row">${referenceIntakePercent.protein}%</text>
  <line x1="18" y1="213" x2="422" y2="213" class="line"/>

  <text x="18" y="231" class="row bold">${rowSalt}</text>
  <text x="235" y="231" class="row">${per100g.salt} g</text>
  <text x="315" y="231" class="row">${perServing.salt} g</text>
  <text x="390" y="231" class="row">${referenceIntakePercent.salt}%</text>
  <line x1="18" y1="240" x2="422" y2="240" class="thick-line"/>

  <text x="18" y="262" class="sub">${footer1}</text>
  <text x="18" y="278" class="sub">${footer2}</text>
</svg>`.trim();
  };

  const handleDownloadSVG = () => {
    setIsExporting(true);
    const svgData = buildLabelSVGString();
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nutrition-label-${productName
      .toLowerCase()
      .replace(/\s+/g, "-")}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  const handleDownloadPNG = () => {
    setIsExporting(true);
    const svgData = buildLabelSVGString();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new window.Image();
    img.onload = () => {
      const scale = 3;
      const canvas = document.createElement("canvas");
      canvas.width = 440 * scale;
      canvas.height = 310 * scale;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `nutrition-label-300dpi-${productName
          .toLowerCase()
          .replace(/\s+/g, "-")}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
      setIsExporting(false);
    };
    img.src = url;
  };

  const displayedIngredientList = isEn
    ? calculation.ingredientsListFormattedEn || calculation.ingredientsListFormatted
    : calculation.ingredientsListFormatted;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 space-y-5">
      {/* Soft Format Switcher */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-stone-500">
          {lang === "en" ? "Format" : "Formato normativo"}
        </span>

        <div className="flex rounded-lg bg-stone-100 p-0.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setStandard("EU")}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              standard === "EU"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            {lang === "en" ? "Europe / UK" : "Europa (UE)"}
          </button>
          <button
            type="button"
            onClick={() => setStandard("FDA")}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              standard === "FDA"
                ? "bg-white text-stone-900 shadow-xs"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            USA (FDA)
          </button>
        </div>
      </div>

      {/* Clean Label Box */}
      <div
        ref={labelRef}
        className="bg-white rounded-xl border border-stone-300 p-5"
      >
        <div className="border-b-2 border-stone-900 pb-2.5 mb-2">
          <h3 className="text-base font-extrabold tracking-tight text-stone-900 uppercase">
            {standard === "FDA"
              ? "Nutrition Facts"
              : isEn
              ? "Nutrition Declaration"
              : "Información Nutricional"}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {isEn ? "Serving size:" : "Tamaño de ración:"}{" "}
            <strong className="font-semibold text-stone-800">
              {servingSizeGrams} g
            </strong>{" "}
            ({calculation.servingsCount}{" "}
            {isEn ? "servings" : "raciones por envase"})
          </p>
        </div>

        {/* Nutrient Table */}
        <div className="overflow-x-auto">
          <table className="nutrition-table-official text-stone-900">
            <thead>
              <tr className="text-left text-xs font-bold text-stone-700">
                <th className="py-2 px-1">
                  {isEn ? "Typical values" : "Valores medios"}
                </th>
                <th className="py-2 px-1 text-right">
                  {isEn ? "Per 100 g" : "Por 100 g"}
                </th>
                <th className="py-2 px-1 text-right">
                  {isEn ? `Per ${servingSizeGrams} g` : `Por ${servingSizeGrams} g`}
                </th>
                <th className="py-2 px-1 text-right">
                  {isEn ? "% RI*" : "% IR*"}
                </th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr className="font-semibold">
                <td className="py-2 px-1">
                  {isEn ? "Energy" : "Valor energético"}
                </td>
                <td className="py-2 px-1 text-right">
                  {per100g.energyKj} kJ / {per100g.energyKcal} kcal
                </td>
                <td className="py-2 px-1 text-right">
                  {perServing.energyKcal} kcal
                </td>
                <td className="py-2 px-1 text-right text-stone-500">
                  {referenceIntakePercent.energy}%
                </td>
              </tr>

              <tr className="font-semibold">
                <td className="py-2 px-1">{isEn ? "Fat" : "Grasas"}</td>
                <td className="py-2 px-1 text-right">
                  {formatNutrientDisplay(per100g.fat, "macro")}
                </td>
                <td className="py-2 px-1 text-right">
                  {formatNutrientDisplay(perServing.fat, "macro")}
                </td>
                <td className="py-2 px-1 text-right text-stone-500">
                  {referenceIntakePercent.fat}%
                </td>
              </tr>
              <tr className="text-stone-500">
                <td className="py-1.5 px-1 pl-4">
                  {isEn ? "of which saturates" : "de las cuales saturadas"}
                </td>
                <td className="py-1.5 px-1 text-right">
                  {formatNutrientDisplay(per100g.saturatedFat, "saturated")}
                </td>
                <td className="py-1.5 px-1 text-right">
                  {formatNutrientDisplay(perServing.saturatedFat, "saturated")}
                </td>
                <td className="py-1.5 px-1 text-right">
                  {referenceIntakePercent.saturatedFat}%
                </td>
              </tr>

              <tr className="font-semibold">
                <td className="py-2 px-1">
                  {isEn ? "Carbohydrate" : "Hidratos de carbono"}
                </td>
                <td className="py-2 px-1 text-right">
                  {formatNutrientDisplay(per100g.carbs, "macro")}
                </td>
                <td className="py-2 px-1 text-right">
                  {formatNutrientDisplay(perServing.carbs, "macro")}
                </td>
                <td className="py-2 px-1 text-right text-stone-500">
                  {referenceIntakePercent.carbs}%
                </td>
              </tr>
              <tr className="text-stone-500">
                <td className="py-1.5 px-1 pl-4">
                  {isEn ? "of which sugars" : "de los cuales azúcares"}
                </td>
                <td className="py-1.5 px-1 text-right">
                  {formatNutrientDisplay(per100g.sugars, "macro")}
                </td>
                <td className="py-1.5 px-1 text-right">
                  {formatNutrientDisplay(perServing.sugars, "macro")}
                </td>
                <td className="py-1.5 px-1 text-right">
                  {referenceIntakePercent.sugars}%
                </td>
              </tr>

              <tr className="font-semibold">
                <td className="py-2 px-1">{isEn ? "Protein" : "Proteínas"}</td>
                <td className="py-2 px-1 text-right">
                  {formatNutrientDisplay(per100g.protein, "macro")}
                </td>
                <td className="py-2 px-1 text-right">
                  {formatNutrientDisplay(perServing.protein, "macro")}
                </td>
                <td className="py-2 px-1 text-right text-stone-500">
                  {referenceIntakePercent.protein}%
                </td>
              </tr>

              <tr className="font-semibold">
                <td className="py-2 px-1">{isEn ? "Salt" : "Sal"}</td>
                <td className="py-2 px-1 text-right">
                  {formatNutrientDisplay(per100g.salt, "salt")}
                </td>
                <td className="py-2 px-1 text-right">
                  {formatNutrientDisplay(perServing.salt, "salt")}
                </td>
                <td className="py-2 px-1 text-right text-stone-500">
                  {referenceIntakePercent.salt}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-2.5 text-[11px] text-stone-400 leading-snug">
          {isEn
            ? "* Reference intake of an average adult (8 400 kJ / 2 000 kcal)."
            : "* Ingesta de referencia de un adulto medio (8 400 kJ / 2 000 kcal)."}
        </p>

        {/* Ingredients & Allergens */}
        <div className="mt-4 pt-3.5 border-t border-stone-200">
          <p className="text-xs font-bold text-stone-800">
            {isEn ? "Ingredients:" : "Ingredientes:"}
          </p>
          <p className="mt-1 text-xs text-stone-600 leading-relaxed">
            {displayedIngredientList.split("**").map((chunk, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="font-bold text-stone-900 underline">
                  {chunk}
                </strong>
              ) : (
                chunk
              )
            )}
          </p>

          {allergens.length > 0 && (
            <div className="mt-3 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950">
              <span className="font-semibold">
                {isEn ? "Allergens: " : "Alérgenos: "}
              </span>
              {allergens.map((a) => (isEn ? a.nameEn : a.nameEs)).join(", ")}.
            </div>
          )}
        </div>
      </div>

      {/* Soft Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handleDownloadPNG}
          disabled={isExporting}
          className="h-11 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
        >
          <ImageIcon className="w-4 h-4 text-emerald-300" />
          <span>{lang === "en" ? "Download PNG" : "Descargar PNG"}</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadSVG}
          disabled={isExporting}
          className="h-11 px-4 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-stone-600" />
          <span>{lang === "en" ? "Download SVG" : "Descargar SVG"}</span>
        </button>
      </div>
    </div>
  );
};
