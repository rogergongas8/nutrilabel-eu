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
  productName = "Food Product",
  lang = "en",
}) => {
  const [standard, setStandard] = useState<"EU" | "FDA">("EU");
  const [isExporting, setIsExporting] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);

  const isEn = lang === "en" || standard === "FDA";

  if (!calculation) {
    return (
      <div className="bg-white rounded-xl border border-neutral-200/90 p-10 text-center">
        <FileCheck className="w-5 h-5 text-neutral-400 mx-auto mb-2" />
        <p className="text-xs text-neutral-500">
          {lang === "en"
            ? "Add ingredients on the left to preview your nutrition label."
            : "Añade ingredientes a la izquierda para ver la etiqueta."}
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

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="440" height="290" viewBox="0 0 440 290">
  <style>
    .title { font-family: Helvetica, Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #171717; }
    .header { font-family: Helvetica, Arial, sans-serif; font-size: 11px; font-weight: bold; fill: #171717; }
    .row { font-family: Helvetica, Arial, sans-serif; font-size: 11px; fill: #171717; }
    .bold { font-weight: bold; }
    .sub { font-family: Helvetica, Arial, sans-serif; fill: #737373; font-size: 9.5px; }
    .line { stroke: #E5E5E5; stroke-width: 1; }
    .thick-line { stroke: #171717; stroke-width: 2; }
  </style>
  <rect width="440" height="290" fill="#ffffff" stroke="#171717" stroke-width="2"/>
  <text x="18" y="30" class="title">${title}</text>
  <line x1="18" y1="38" x2="422" y2="38" class="thick-line"/>
  <text x="18" y="54" class="header">${col1}</text>
  <text x="235" y="54" class="header">${col2}</text>
  <text x="315" y="54" class="header">${col3}</text>
  <text x="385" y="54" class="header">${col4}</text>
  <line x1="18" y1="61" x2="422" y2="61" class="thick-line"/>
  
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

  <text x="18" y="264" class="sub">${footer1}</text>
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
      canvas.height = 290 * scale;
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
    <div className="bg-white rounded-xl border border-neutral-200/90 p-5 space-y-4">
      {/* Top Format Switcher */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500">
          {lang === "en" ? "Label Preview" : "Vista previa"}
        </span>

        <div className="flex rounded-lg bg-neutral-100 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setStandard("EU")}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              standard === "EU"
                ? "bg-emerald-600 text-white font-semibold shadow-2xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            EU / UK
          </button>
          <button
            type="button"
            onClick={() => setStandard("FDA")}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              standard === "FDA"
                ? "bg-emerald-600 text-white font-semibold shadow-2xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            US FDA
          </button>
        </div>
      </div>

      {/* Crisp Label Box */}
      <div
        ref={labelRef}
        className="bg-white rounded-lg border border-neutral-300 p-4"
      >
        <div className="border-b-2 border-neutral-900 pb-2 mb-1.5">
          <h3 className="text-sm font-bold tracking-tight text-neutral-900 uppercase">
            {standard === "FDA"
              ? "Nutrition Facts"
              : isEn
              ? "Nutrition Declaration"
              : "Información Nutricional"}
          </h3>
          <p className="text-[11px] text-neutral-500">
            {isEn ? "Serving:" : "Ración:"} {servingSizeGrams} g
          </p>
        </div>

        <table className="nutrition-table-official text-neutral-900">
          <thead>
            <tr className="text-left text-[11px] font-semibold text-neutral-500">
              <th className="py-1.5">
                {isEn ? "Typical values" : "Valores medios"}
              </th>
              <th className="py-1.5 text-right">100 g</th>
              <th className="py-1.5 text-right">{servingSizeGrams} g</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            <tr className="font-medium">
              <td className="py-1.5">{isEn ? "Energy" : "Energía"}</td>
              <td className="py-1.5 text-right">
                {per100g.energyKj} kJ / {per100g.energyKcal} kcal
              </td>
              <td className="py-1.5 text-right">{perServing.energyKcal} kcal</td>
            </tr>
            <tr className="font-medium">
              <td className="py-1.5">{isEn ? "Fat" : "Grasas"}</td>
              <td className="py-1.5 text-right">
                {formatNutrientDisplay(per100g.fat, "macro")}
              </td>
              <td className="py-1.5 text-right">
                {formatNutrientDisplay(perServing.fat, "macro")}
              </td>
            </tr>
            <tr className="text-neutral-500">
              <td className="py-1 pl-3">
                {isEn ? "of which saturates" : "de las cuales saturadas"}
              </td>
              <td className="py-1 text-right">
                {formatNutrientDisplay(per100g.saturatedFat, "saturated")}
              </td>
              <td className="py-1 text-right">
                {formatNutrientDisplay(perServing.saturatedFat, "saturated")}
              </td>
            </tr>
            <tr className="font-medium">
              <td className="py-1.5">
                {isEn ? "Carbohydrate" : "Hidratos de carbono"}
              </td>
              <td className="py-1.5 text-right">
                {formatNutrientDisplay(per100g.carbs, "macro")}
              </td>
              <td className="py-1.5 text-right">
                {formatNutrientDisplay(perServing.carbs, "macro")}
              </td>
            </tr>
            <tr className="text-neutral-500">
              <td className="py-1 pl-3">
                {isEn ? "of which sugars" : "de los cuales azúcares"}
              </td>
              <td className="py-1 text-right">
                {formatNutrientDisplay(per100g.sugars, "macro")}
              </td>
              <td className="py-1 text-right">
                {formatNutrientDisplay(perServing.sugars, "macro")}
              </td>
            </tr>
            <tr className="font-medium">
              <td className="py-1.5">{isEn ? "Protein" : "Proteínas"}</td>
              <td className="py-1.5 text-right">
                {formatNutrientDisplay(per100g.protein, "macro")}
              </td>
              <td className="py-1.5 text-right">
                {formatNutrientDisplay(perServing.protein, "macro")}
              </td>
            </tr>
            <tr className="font-medium">
              <td className="py-1.5">{isEn ? "Salt" : "Sal"}</td>
              <td className="py-1.5 text-right">
                {formatNutrientDisplay(per100g.salt, "salt")}
              </td>
              <td className="py-1.5 text-right">
                {formatNutrientDisplay(perServing.salt, "salt")}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Ingredients */}
        <div className="mt-3 pt-2.5 border-t border-neutral-200 text-xs">
          <span className="font-semibold text-neutral-900">
            {isEn ? "Ingredients: " : "Ingredientes: "}
          </span>
          <span className="text-neutral-600 leading-relaxed">
            {displayedIngredientList.split("**").map((chunk, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="font-semibold text-neutral-900 underline">
                  {chunk}
                </strong>
              ) : (
                chunk
              )
            )}
          </span>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleDownloadPNG}
          disabled={isExporting}
          className="h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{lang === "en" ? "Download PNG" : "Descargar PNG"}</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadSVG}
          disabled={isExporting}
          className="h-10 px-4 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{lang === "en" ? "Download SVG" : "Descargar SVG"}</span>
        </button>
      </div>
    </div>
  );
};
