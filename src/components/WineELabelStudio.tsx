"use client";

import React, { useState, useMemo } from "react";
import { Wine, Download, Smartphone, ExternalLink } from "lucide-react";
import { calculateWineNutrition, WineInput } from "@/lib/wine-calculator";
import { generateQRMatrix } from "@/lib/qr-encoder";

export const WineELabelStudio: React.FC = () => {
  const [wine, setWine] = useState<WineInput>({
    wineName: "Viña Pedrosa Reserva",
    vintageYear: "2024",
    appellation: "D.O.Ca. Rioja",
    wineType: "tinto",
    abvPercent: 14.0,
    residualSugarGPerL: 2.2,
    totalAcidityGPerL: 5.4,
    glycerolGPerL: 7.0,
    containsSulfites: true,
    containsEggAlbumin: false,
    containsMilkCasein: false,
    isOrganic: true,
    isVegan: true,
  });

  const [previewLang, setPreviewLang] = useState<"es" | "en">("es");

  const result = useMemo(() => calculateWineNutrition(wine), [wine]);
  const qrMatrix = useMemo(
    () => generateQRMatrix(result.eLabelUrl),
    [result.eLabelUrl]
  );

  const handleDownloadWineSVG = () => {
    const quietZone = 4;
    const moduleSize = 7;
    const totalModules = qrMatrix.size + quietZone * 2;
    const qrPixelSize = totalModules * moduleSize;
    const svgWidth = 340;
    const svgHeight = qrPixelSize + 130;
    const offsetX = Math.floor((svgWidth - qrPixelSize) / 2);
    const offsetY = 24;

    let rects = "";
    for (let r = 0; r < qrMatrix.size; r++) {
      for (let c = 0; c < qrMatrix.size; c++) {
        if (qrMatrix.modules[r][c]) {
          const x = offsetX + (c + quietZone) * moduleSize;
          const y = offsetY + (r + quietZone) * moduleSize;
          rects += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="#111613"/>`;
        }
      }
    }

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <rect width="${svgWidth}" height="${svgHeight}" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" rx="12"/>
  <text x="${svgWidth / 2}" y="20" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#111613">INGREDIENTES E INFORMACIÓN NUTRICIONAL</text>
  ${rects}
  <rect x="24" y="${offsetY + qrPixelSize + 10}" width="${svgWidth - 48}" height="32" rx="6" fill="#F8F7F4" stroke="#CBD5E1" stroke-width="1"/>
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 31}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="bold" fill="#111613">${result.bottleSymbolText}</text>
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 60}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#111613">${
      result.allergensEs.length > 0
        ? `Contiene: ${result.allergensEs.join(", ")}`
        : "Sin alérgenos declarables"
    }</text>
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 76}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="9" fill="#64748B">Reglamento (UE) 2021/2117 · E-Label Sin Cookies</text>
</svg>`;

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `elabel-vino-${wine.wineName
      .toLowerCase()
      .replace(/\s+/g, "-")}-${wine.vintageYear}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 7 Cols: Soft Oenological Card */}
      <div className="lg:col-span-7">
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                Etiqueta QR para Vinos y Bebidas (UE 2021/2117)
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Calcula la energía por 100 ml y genera el código QR sin cookies obligatorio.
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Wine className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                Nombre del Vino o Bebida
              </label>
              <input
                type="text"
                value={wine.wineName}
                onChange={(e) => setWine({ ...wine, wineName: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl bg-stone-50/70 border border-stone-200 focus:bg-white focus:border-emerald-700 text-sm font-semibold text-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                Añada / Cosecha
              </label>
              <input
                type="text"
                value={wine.vintageYear}
                onChange={(e) =>
                  setWine({ ...wine, vintageYear: e.target.value })
                }
                className="w-full h-11 px-3.5 rounded-xl bg-stone-50/70 border border-stone-200 focus:bg-white focus:border-emerald-700 text-sm font-semibold text-stone-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-stone-50/60 border border-stone-200/70">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Grado Alcohólico (% vol)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="60"
                value={wine.abvPercent}
                onChange={(e) =>
                  setWine({
                    ...wine,
                    abvPercent: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full h-10 px-3 rounded-lg bg-white border border-stone-200 text-sm font-bold text-stone-900 focus:border-emerald-700 focus:outline-none"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                {result.per100ml.alcoholGrams} g etanol / 100 ml
              </span>
            </div>

            <div className="p-4 rounded-xl bg-stone-50/60 border border-stone-200/70">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Azúcares Residuales (g/L)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={wine.residualSugarGPerL}
                onChange={(e) =>
                  setWine({
                    ...wine,
                    residualSugarGPerL: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full h-10 px-3 rounded-lg bg-white border border-stone-200 text-sm font-bold text-stone-900 focus:border-emerald-700 focus:outline-none"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                Equivale a {result.per100ml.sugars} g por 100 ml
              </span>
            </div>

            <div className="p-4 rounded-xl bg-stone-50/60 border border-stone-200/70">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Acidez Total (g/L ácido tartárico)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={wine.totalAcidityGPerL}
                onChange={(e) =>
                  setWine({
                    ...wine,
                    totalAcidityGPerL: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full h-10 px-3 rounded-lg bg-white border border-stone-200 text-sm font-bold text-stone-900 focus:border-emerald-700 focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-xl bg-stone-50/60 border border-stone-200/70">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Glicerol (g/L)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={wine.glycerolGPerL}
                onChange={(e) =>
                  setWine({
                    ...wine,
                    glycerolGPerL: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full h-10 px-3 rounded-lg bg-white border border-stone-200 text-sm font-bold text-stone-900 focus:border-emerald-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <p className="text-xs font-semibold text-stone-600 mb-2.5">
              Opciones y alérgenos del vino:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-700">
              {[
                {
                  checked: wine.containsSulfites,
                  label: "Contiene Sulfitos (E-220)",
                  key: "containsSulfites" as const,
                },
                {
                  checked: wine.isOrganic,
                  label: "Uvas Ecológicas Certificadas",
                  key: "isOrganic" as const,
                },
                {
                  checked: wine.containsEggAlbumin,
                  label: "Clarificado con Albúmina de Huevo",
                  key: "containsEggAlbumin" as const,
                },
                {
                  checked: wine.containsMilkCasein,
                  label: "Clarificado con Caseína Láctea",
                  key: "containsMilkCasein" as const,
                },
              ].map((opt) => (
                <label
                  key={opt.key}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50/70 border border-stone-200/70 cursor-pointer hover:bg-stone-100/60 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={opt.checked}
                    onChange={(e) =>
                      setWine({ ...wine, [opt.key]: e.target.checked })
                    }
                    className="accent-emerald-800 w-4 h-4 rounded"
                  />
                  <span className="font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right 5 Cols: Soft Preview Card */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-stone-50 border border-stone-200/70">
            <div className="bg-white p-2.5 rounded-xl border border-stone-200 shrink-0 shadow-2xs">
              <svg
                viewBox={`0 0 ${qrMatrix.size + 4} ${qrMatrix.size + 4}`}
                className="w-26 h-26"
                shapeRendering="crispEdges"
              >
                <rect
                  width={qrMatrix.size + 4}
                  height={qrMatrix.size + 4}
                  fill="#FFFFFF"
                />
                {qrMatrix.modules.map((row, r) =>
                  row.map((cell, c) =>
                    cell ? (
                      <rect
                        key={`${r}-${c}`}
                        x={c + 2}
                        y={r + 2}
                        width={1}
                        height={1}
                        fill="#111613"
                      />
                    ) : null
                  )
                )}
              </svg>
            </div>

            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Impresión en botella
              </span>
              <p className="text-base font-bold text-stone-900 pt-1">
                {result.bottleSymbolText}
              </p>
              <p className="text-xs text-stone-500">
                {result.allergensEs.length > 0
                  ? `Contiene: ${result.allergensEs.join(", ")}`
                  : "Exento de alérgenos"}
              </p>
            </div>
          </div>

          {/* Mobile E-Label Preview */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                Vista en el móvil al escanear el QR:
              </span>
              <div className="flex rounded-lg bg-stone-100 p-0.5 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setPreviewLang("es")}
                  className={`px-2 py-0.5 rounded-md cursor-pointer ${
                    previewLang === "es"
                      ? "bg-white text-stone-900 shadow-2xs"
                      : "text-stone-500"
                  }`}
                >
                  ES
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLang("en")}
                  className={`px-2 py-0.5 rounded-md cursor-pointer ${
                    previewLang === "en"
                      ? "bg-white text-stone-900 shadow-2xs"
                      : "text-stone-500"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50/70 border border-stone-200/70 text-xs space-y-2.5">
              <p className="font-bold text-stone-900">
                {wine.wineName} ({wine.vintageYear}) · {wine.abvPercent}% vol
              </p>
              <table className="w-full text-xs border-t border-b border-stone-200 divide-y divide-stone-100">
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="py-1.5 font-semibold text-stone-700">
                      {previewLang === "es" ? "Valor energético" : "Energy"}
                    </td>
                    <td className="py-1.5 text-right font-bold text-stone-900">
                      {result.per100ml.energyKj} kJ /{" "}
                      {result.per100ml.energyKcal} kcal
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-stone-600">
                      {previewLang === "es"
                        ? "Hidratos de carbono"
                        : "Carbohydrates"}
                    </td>
                    <td className="py-1.5 text-right">{result.per100ml.carbs} g</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 pl-3 text-stone-400">
                      {previewLang === "es"
                        ? "de los cuales azúcares"
                        : "of which sugars"}
                    </td>
                    <td className="py-1.5 text-right">{result.per100ml.sugars} g</td>
                  </tr>
                </tbody>
              </table>

              <p className="text-xs leading-relaxed text-stone-600 pt-1">
                <strong className="text-stone-800">
                  {previewLang === "es" ? "Ingredientes: " : "Ingredients: "}
                </strong>
                {(previewLang === "es"
                  ? result.ingredientsListEs
                  : result.ingredientsListEn
                )
                  .split("**")
                  .map((chunk, i) =>
                    i % 2 === 1 ? (
                      <strong key={i} className="underline font-semibold text-stone-900">
                        {chunk}
                      </strong>
                    ) : (
                      chunk
                    )
                  )}
              </p>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={handleDownloadWineSVG}
              className="w-full h-11 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span>Descargar etiqueta QR (.SVG)</span>
            </button>

            <a
              href={result.localELabelPath}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-10 px-4 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir página pública del QR (5 idiomas)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
