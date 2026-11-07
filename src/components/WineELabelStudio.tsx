"use client";

import React, { useState, useMemo } from "react";
import { Wine, Download, QrCode, ShieldCheck, CheckCircle2, Smartphone } from "lucide-react";
import { calculateWineNutrition, WineInput } from "@/lib/wine-calculator";
import { generateQRMatrix } from "@/lib/qr-encoder";
import { Button } from "@/components/ui/button";

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
  const qrMatrix = useMemo(() => generateQRMatrix(result.eLabelUrl), [result.eLabelUrl]);

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
  <rect width="${svgWidth}" height="${svgHeight}" fill="#FFFFFF" stroke="#111613" stroke-width="2"/>
  <text x="${svgWidth / 2}" y="18" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#111613">INGREDIENTES E INFORMACIÓN NUTRICIONAL</text>
  ${rects}
  <rect x="24" y="${offsetY + qrPixelSize + 10}" width="${svgWidth - 48}" height="32" fill="#F6F3EC" stroke="#111613" stroke-width="1.5"/>
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 31}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="bold" fill="#111613">${result.bottleSymbolText}</text>
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 60}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#111613">${
      result.allergensEs.length > 0 ? `Contiene: ${result.allergensEs.join(", ")}` : "Sin alérgenos declarables"
    }</text>
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 76}" text-anchor="middle" font-family="Courier New, monospace" font-size="8.5" fill="#5A625E">Reglamento (UE) 2021/2117 · E-Label Sin Cookies</text>
</svg>`;

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `elabel-vino-${wine.wineName.toLowerCase().replace(/\s+/g, "-")}-${wine.vintageYear}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 7 Cols: Oenological Input Parameters */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-surface border-2 border-primary p-6 shadow-tactile-sm space-y-5">
          <div className="flex items-center justify-between border-b-2 border-primary/15 pb-3">
            <div>
              <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
                REGLAMENTO (UE) 2021/2117 // E-LABEL VITIVINÍCOLA
              </span>
              <h2 className="font-display text-2xl font-bold text-primary mt-0.5">
                Analítica Enológica y Declaración de Contraetiqueta
              </h2>
            </div>
            <Wine className="w-6 h-6 text-accent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-mono text-xs font-bold text-primary mb-1">
                Nombre del Vino / Vermut / Bebida:
              </label>
              <input
                type="text"
                value={wine.wineName}
                onChange={(e) => setWine({ ...wine, wineName: e.target.value })}
                className="w-full h-10 px-3 bg-white border-2 border-primary/30 focus:border-primary text-sm font-bold text-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold text-primary mb-1">
                Añada / Cosecha:
              </label>
              <input
                type="text"
                value={wine.vintageYear}
                onChange={(e) => setWine({ ...wine, vintageYear: e.target.value })}
                className="w-full h-10 px-3 bg-white border-2 border-primary/30 focus:border-primary font-mono text-sm font-bold text-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Chemical Analysis Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 bg-white border border-primary/25">
              <label className="block font-mono text-xs font-bold text-primary mb-1">
                Grado Alcohólico Volumétrico (% vol):
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="60"
                value={wine.abvPercent}
                onChange={(e) =>
                  setWine({ ...wine, abvPercent: parseFloat(e.target.value) || 0 })
                }
                className="w-full h-10 px-3 bg-[#F6F3EC] border-2 border-primary font-mono text-base font-bold text-primary focus:outline-none"
              />
              <span className="font-mono text-[10px] text-neutral mt-1 block">
                Factor UE Anexo XIV: {result.per100ml.alcoholGrams} g etanol/100ml × 29 kJ (7 kcal)
              </span>
            </div>

            <div className="p-3.5 bg-white border border-primary/25">
              <label className="block font-mono text-xs font-bold text-primary mb-1">
                Azúcares Residuales (g/L):
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
                className="w-full h-10 px-3 bg-[#F6F3EC] border-2 border-primary font-mono text-base font-bold text-primary focus:outline-none"
              />
              <span className="font-mono text-[10px] text-neutral mt-1 block">
                Equivale a {result.per100ml.sugars} g de azúcares por 100 ml
              </span>
            </div>

            <div className="p-3.5 bg-white border border-primary/25">
              <label className="block font-mono text-xs font-bold text-primary mb-1">
                Acidez Total (g/L en ácido tartárico):
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
                className="w-full h-10 px-3 bg-[#F6F3EC] border-2 border-primary font-mono text-base font-bold text-primary focus:outline-none"
              />
              <span className="font-mono text-[10px] text-neutral mt-1 block">
                Ácidos orgánicos: 13 kJ/g (3 kcal/g)
              </span>
            </div>

            <div className="p-3.5 bg-white border border-primary/25">
              <label className="block font-mono text-xs font-bold text-primary mb-1">
                Polialcoholes / Glicerol (g/L):
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
                className="w-full h-10 px-3 bg-[#F6F3EC] border-2 border-primary font-mono text-base font-bold text-primary focus:outline-none"
              />
              <span className="font-mono text-[10px] text-neutral mt-1 block">
                Estándar enológico vino seco: ~7,0 g/L (10 kJ/g)
              </span>
            </div>
          </div>

          {/* Allergens & Clarifying Agents */}
          <div className="pt-2 border-t border-primary/15">
            <p className="font-mono text-xs font-bold uppercase text-primary mb-3">
              Alérgenos de Impresión Física Obligatoria en Botella:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-medium text-primary">
              <label className="flex items-center gap-2.5 p-2.5 bg-white border border-primary/25 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wine.containsSulfites}
                  onChange={(e) =>
                    setWine({ ...wine, containsSulfites: e.target.checked })
                  }
                  className="accent-[#D94E28] w-4 h-4"
                />
                <span>Contiene Sulfitos (E-220 &gt; 10 mg/L)</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 bg-white border border-primary/25 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wine.isOrganic}
                  onChange={(e) =>
                    setWine({ ...wine, isOrganic: e.target.checked })
                  }
                  className="accent-[#D94E28] w-4 h-4"
                />
                <span>Uvas Ecológicas Certificadas</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 bg-white border border-primary/25 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wine.containsEggAlbumin}
                  onChange={(e) =>
                    setWine({ ...wine, containsEggAlbumin: e.target.checked })
                  }
                  className="accent-[#D94E28] w-4 h-4"
                />
                <span>Clarificado con Albúmina de Huevo</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 bg-white border border-primary/25 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wine.containsMilkCasein}
                  onChange={(e) =>
                    setWine({ ...wine, containsMilkCasein: e.target.checked })
                  }
                  className="accent-[#D94E28] w-4 h-4"
                />
                <span>Clarificado con Caseína Láctea</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Right 5 Cols: Physical Bottle Stamp + Scannable E-Label QR + Mobile Preview */}
      <div className="lg:col-span-5 space-y-5">
        <div className="bg-white border-2 border-ink p-6 shadow-tactile crop-marks">
          <div className="flex items-center justify-between font-mono text-[10px] text-neutral border-b border-dashed border-ink/30 pb-2 mb-4">
            <span>CONTRAETIQUETA FÍSICA + QR E-LABEL</span>
            <span>REGLAMENTO (UE) 2021/2117</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-[#F6F3EC] border border-primary/30">
            {/* Real Scannable QR SVG */}
            <div className="bg-white p-2 border border-ink shrink-0">
              <svg
                viewBox={`0 0 ${qrMatrix.size + 4} ${qrMatrix.size + 4}`}
                className="w-28 h-28"
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

            {/* Mandatory Physical Bottle Symbols */}
            <div className="space-y-2 text-center sm:text-left">
              <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 bg-primary text-[#F6F3EC]">
                OBLIGATORIO EN BOTELLA FÍSICA
              </span>
              <p className="font-mono text-base font-black text-ink border-2 border-ink bg-white px-3 py-1.5">
                {result.bottleSymbolText}
              </p>
              <p className="text-xs font-bold text-accent">
                {result.allergensEs.length > 0
                  ? `Contiene: ${result.allergensEs.join(", ")}`
                  : "Exento de alérgenos"}
              </p>
            </div>
          </div>

          {/* Mobile E-Label Preview (What opens when scanning QR) */}
          <div className="mt-5 pt-4 border-t-2 border-ink">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] font-bold uppercase text-primary flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-accent" />
                Vista E-Label Móvil (0% Cookies):
              </span>
              <div className="flex border border-primary text-[10px] font-mono font-bold">
                <button
                  type="button"
                  onClick={() => setPreviewLang("es")}
                  className={`px-2 py-0.5 cursor-pointer ${
                    previewLang === "es" ? "bg-primary text-white" : "text-primary"
                  }`}
                >
                  ES
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLang("en")}
                  className={`px-2 py-0.5 cursor-pointer ${
                    previewLang === "en" ? "bg-primary text-white" : "text-primary"
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            <div className="p-3 bg-surface border border-primary/25 text-xs space-y-2">
              <p className="font-bold text-primary">
                {wine.wineName} ({wine.vintageYear}) · {wine.abvPercent}% vol
              </p>
              <table className="w-full text-xs border-t border-b border-primary/20 divide-y divide-primary/10">
                <thead>
                  <tr className="font-bold text-left">
                    <th className="py-1">
                      {previewLang === "es" ? "Valores medios" : "Average values"}
                    </th>
                    <th className="py-1 text-right">Por 100 ml</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                  <tr>
                    <td className="py-1 font-bold">
                      {previewLang === "es" ? "Valor energético" : "Energy"}
                    </td>
                    <td className="py-1 text-right font-bold">
                      {result.per100ml.energyKj} kJ / {result.per100ml.energyKcal} kcal
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">
                      {previewLang === "es" ? "Hidratos de carbono" : "Carbohydrates"}
                    </td>
                    <td className="py-1 text-right">{result.per100ml.carbs} g</td>
                  </tr>
                  <tr>
                    <td className="py-1 pl-3 text-neutral">
                      {previewLang === "es" ? "de los cuales azúcares" : "of which sugars"}
                    </td>
                    <td className="py-1 text-right">{result.per100ml.sugars} g</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-[11px] text-neutral" colSpan={2}>
                      {previewLang === "es"
                        ? "Contiene cantidades insignificantes de grasas, ácidos grasos saturados, proteínas y sal."
                        : "Contains negligible amounts of fat, saturates, protein and salt."}
                    </td>
                  </tr>
                </tbody>
              </table>

              <p className="text-[11px] leading-snug text-ink pt-1">
                <strong>
                  {previewLang === "es" ? "INGREDIENTES: " : "INGREDIENTS: "}
                </strong>
                {(previewLang === "es"
                  ? result.ingredientsListEs
                  : result.ingredientsListEn
                )
                  .split("**")
                  .map((chunk, i) =>
                    i % 2 === 1 ? (
                      <strong key={i} className="underline font-black">
                        {chunk}
                      </strong>
                    ) : (
                      chunk
                    )
                  )}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="accent"
          size="lg"
          onClick={handleDownloadWineSVG}
          className="w-full"
        >
          <Download className="w-4 h-4" />
          <span>Descargar Sello E + QR Vectorial (.SVG Imprenta)</span>
        </Button>

        <div className="p-3 bg-surface border border-primary/30 text-xs text-primary flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
          <span>
            Sin cookies de rastreo ni scripts publicitarios conforme al Art. 119 Reglamento (UE) 1308/2013 modificado por (UE) 2021/2117.
          </span>
        </div>
      </div>
    </div>
  );
};
