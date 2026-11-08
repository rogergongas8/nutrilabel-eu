"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Wine, Download, Smartphone, ExternalLink } from "lucide-react";
import { calculateWineNutrition, WineInput } from "@/lib/wine-calculator";
import { generateQRMatrix } from "@/lib/qr-encoder";
import { WaitlistForm } from "@/components/WaitlistForm";

const PAYMENTS_ENABLED = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "1";

export interface WineEditContext {
  id: string;
  token: string;
  /** Permanent public URL: this is what the bottle QR encodes. */
  publicUrl: string;
  initialWine: WineInput;
}

export const WineELabelStudio: React.FC<{ lang?: "es" | "en"; edit?: WineEditContext }> = ({
  lang = "en",
  edit,
}) => {
  const isEn = lang === "en";

  const [wine, setWine] = useState<WineInput>(edit?.initialWine ?? {
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

  const [previewLang, setPreviewLang] = useState<"es" | "en">(lang);

  useEffect(() => {
    setPreviewLang(lang);
  }, [lang]);

  const result = useMemo(() => calculateWineNutrition(wine, lang), [wine, lang]);
  const qrMatrix = useMemo(
    () => generateQRMatrix(edit?.publicUrl ?? result.eLabelUrl),
    [edit?.publicUrl, result.eLabelUrl]
  );

  const [publishEmail, setPublishEmail] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleSave = async () => {
    if (!edit) return;
    setSaveState("saving");
    try {
      const res = await fetch(`/api/elabels/${edit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wine, editToken: edit.token }),
      });
      setSaveState(res.ok ? "saved" : "error");
    } catch {
      setSaveState("error");
    }
  };

  const handlePublish = async () => {
    setPublishError("");
    setPublishing(true);
    try {
      const created = await fetch("/api/elabels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wine, email: publishEmail }),
      });
      if (!created.ok) {
        const { error } = await created.json().catch(() => ({ error: "" }));
        throw new Error(error || "error");
      }
      const { id, editToken } = await created.json();

      const checkout = await fetch(`/api/elabels/${id}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editToken }),
      });
      if (!checkout.ok) throw new Error("checkout");
      const { url } = await checkout.json();
      window.location.href = url;
    } catch (e) {
      setPublishing(false);
      setPublishError(
        isEn
          ? `Could not start publishing (${(e as Error).message}). Check the email and try again.`
          : `No se pudo iniciar la publicación (${(e as Error).message}). Revisa el email e inténtalo de nuevo.`
      );
    }
  };

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
          rects += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="#171717"/>`;
        }
      }
    }

    const svgTitle = isEn
      ? "INGREDIENTS & NUTRITION DECLARATION"
      : "INGREDIENTES E INFORMACIÓN NUTRICIONAL";
    const allergenLine = isEn
      ? result.allergensEn.length > 0
        ? `Contains: ${result.allergensEn.join(", ")}`
        : "No declarable allergens"
      : result.allergensEs.length > 0
      ? `Contiene: ${result.allergensEs.join(", ")}`
      : "Sin alérgenos declarables";
    const regLine = isEn
      ? "Regulation (EU) 2021/2117 · Cookie-Free E-Label"
      : "Reglamento (UE) 2021/2117 · E-Label Sin Cookies";

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
  <rect width="${svgWidth}" height="${svgHeight}" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2" rx="12"/>
  <text x="${svgWidth / 2}" y="20" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="bold" fill="#171717">${svgTitle}</text>
  ${rects}
  <rect x="24" y="${offsetY + qrPixelSize + 10}" width="${svgWidth - 48}" height="32" rx="6" fill="#FAFAFA" stroke="#E5E5E5" stroke-width="1"/>
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 31}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="bold" fill="#171717">${result.bottleSymbolText}</text>
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 60}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="10" font-weight="bold" fill="#171717">${allergenLine}</text>
  <text x="${svgWidth / 2}" y="${offsetY + qrPixelSize + 76}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="9" fill="#737373">${regLine}</text>
</svg>`;

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `wine-elabel-${wine.wineName
      .toLowerCase()
      .replace(/\s+/g, "-")}-${wine.vintageYear}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 7 Cols */}
      <div className="lg:col-span-7">
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">
                {isEn
                  ? "EU Wine QR E-Label (Reg. 2021/2117)"
                  : "Etiqueta QR para Vinos (UE 2021/2117)"}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {isEn
                  ? "Energy per 100 ml & cookie-free QR code generator."
                  : "Energía por 100 ml y generador de código QR sin cookies."}
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
              <Wine className="w-4 h-4" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                {isEn ? "Wine Name" : "Nombre del Vino"}
              </label>
              <input
                type="text"
                value={wine.wineName}
                onChange={(e) => setWine({ ...wine, wineName: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl bg-white border border-neutral-200 focus:border-neutral-900 text-sm font-medium text-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                {isEn ? "Vintage" : "Añada"}
              </label>
              <input
                type="text"
                value={wine.vintageYear}
                onChange={(e) =>
                  setWine({ ...wine, vintageYear: e.target.value })
                }
                className="w-full h-10 px-3.5 rounded-xl bg-white border border-neutral-200 focus:border-neutral-900 text-sm font-medium text-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <label className="block text-xs font-medium text-neutral-600 mb-1">
                {isEn ? "Alcohol (% ABV)" : "Alcohol (% vol)"}
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
                className="w-full h-9 px-2.5 rounded-lg bg-white border border-neutral-200 text-sm font-semibold text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <label className="block text-xs font-medium text-neutral-600 mb-1">
                {isEn ? "Sugars (g/L)" : "Azúcares (g/L)"}
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
                className="w-full h-9 px-2.5 rounded-lg bg-white border border-neutral-200 text-sm font-semibold text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <label className="block text-xs font-medium text-neutral-600 mb-1">
                {isEn ? "Acidity (g/L)" : "Acidez (g/L)"}
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
                className="w-full h-9 px-2.5 rounded-lg bg-white border border-neutral-200 text-sm font-semibold text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <label className="block text-xs font-medium text-neutral-600 mb-1">
                {isEn ? "Glycerol (g/L)" : "Glicerol (g/L)"}
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
                className="w-full h-9 px-2.5 rounded-lg bg-white border border-neutral-200 text-sm font-semibold text-neutral-900 focus:border-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-neutral-600 mb-2">
              {isEn ? "Allergens & attributes:" : "Alérgenos y opciones:"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-neutral-800">
              {[
                {
                  checked: wine.containsSulfites,
                  label: isEn ? "Contains Sulphites (E-220)" : "Contiene Sulfitos (E-220)",
                  key: "containsSulfites" as const,
                },
                {
                  checked: wine.isOrganic,
                  label: isEn ? "Organic Grapes" : "Uvas Ecológicas",
                  key: "isOrganic" as const,
                },
                {
                  checked: wine.containsEggAlbumin,
                  label: isEn ? "Egg Albumin" : "Albúmina de Huevo",
                  key: "containsEggAlbumin" as const,
                },
                {
                  checked: wine.containsMilkCasein,
                  label: isEn ? "Milk Casein" : "Caseína Láctea",
                  key: "containsMilkCasein" as const,
                },
              ].map((opt) => (
                <label
                  key={opt.key}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 cursor-pointer hover:bg-neutral-100/70 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={opt.checked}
                    onChange={(e) =>
                      setWine({ ...wine, [opt.key]: e.target.checked })
                    }
                    className="accent-neutral-900 w-4 h-4 rounded"
                  />
                  <span className="font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right 5 Cols */}
      <div className="lg:col-span-5">
        <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs p-6 space-y-5">
          {/* Prominent QR Code Section */}
          <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full mb-3">
              {isEn
                ? "Regulation (EU) 2021/2117 · Bottle QR"
                : "Reglamento (UE) 2021/2117 · QR para Botella"}
            </span>

            <div className="bg-white p-3.5 rounded-2xl border border-neutral-200/80 shadow-2xs">
              <svg
                viewBox={`0 0 ${qrMatrix.size + 4} ${qrMatrix.size + 4}`}
                className="w-40 h-40"
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
                        fill="#171717"
                      />
                    ) : null
                  )
                )}
              </svg>
            </div>

            <div className="mt-3 space-y-1">
              <p className="text-sm font-bold text-neutral-900">
                {result.bottleSymbolText}
              </p>
              <p className="text-xs text-neutral-500">
                {isEn
                  ? result.allergensEn.length > 0
                    ? `Contains: ${result.allergensEn.join(", ")}`
                    : "No declarable allergens"
                  : result.allergensEs.length > 0
                  ? `Contiene: ${result.allergensEs.join(", ")}`
                  : "Sin alérgenos declarables"}
              </p>
            </div>
          </div>

          {/* Mobile E-Label Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-neutral-600 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-neutral-500" />
                {isEn ? "Mobile landing page view" : "Vista en el móvil al escanear"}
              </span>
              <div className="flex rounded-lg bg-neutral-100 p-0.5 text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => setPreviewLang("en")}
                  className={`px-2 py-0.5 rounded-md cursor-pointer ${
                    previewLang === "en"
                      ? "bg-white text-emerald-700 font-semibold shadow-2xs"
                      : "text-neutral-500"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLang("es")}
                  className={`px-2 py-0.5 rounded-md cursor-pointer ${
                    previewLang === "es"
                      ? "bg-white text-emerald-700 font-semibold shadow-2xs"
                      : "text-neutral-500"
                  }`}
                >
                  ES
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs space-y-2">
              <p className="font-semibold text-neutral-900">
                {wine.wineName} ({wine.vintageYear}) · {wine.abvPercent}% vol
              </p>
              <table className="w-full text-xs border-t border-b border-neutral-200 divide-y divide-neutral-200/60">
                <tbody>
                  <tr>
                    <td className="py-1.5 font-medium text-neutral-700">
                      {previewLang === "es" ? "Valor energético" : "Energy"}
                    </td>
                    <td className="py-1.5 text-right font-semibold text-neutral-900">
                      {result.per100ml.energyKj} kJ / {result.per100ml.energyKcal} kcal
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-neutral-600">
                      {previewLang === "es" ? "Hidratos de carbono" : "Carbohydrates"}
                    </td>
                    <td className="py-1.5 text-right">{result.per100ml.carbs} g</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 pl-3 text-neutral-500">
                      {previewLang === "es" ? "de los cuales azúcares" : "of which sugars"}
                    </td>
                    <td className="py-1.5 text-right">{result.per100ml.sugars} g</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleDownloadWineSVG}
              className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isEn ? "Download QR (.SVG)" : "Descargar QR (.SVG)"}</span>
            </button>

            <a
              href={edit?.publicUrl ?? result.localELabelPath}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-4 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 text-xs font-medium flex items-center justify-center gap-2 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isEn ? "Open Mobile Page" : "Abrir Ficha Móvil"}</span>
            </a>
          </div>

          {edit ? (
            <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 space-y-2.5">
              <p className="text-xs font-semibold text-emerald-900">
                {isEn ? "Editing your hosted e-label" : "Editando tu e-label alojada"}
              </p>
              <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                {isEn
                  ? "Changes go live at the same address. The printed QR does not change."
                  : "Los cambios se publican en la misma dirección. El QR impreso no cambia."}
              </p>
              <button
                type="button"
                onClick={handleSave}
                disabled={saveState === "saving"}
                className="w-full h-10 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-60 text-white text-xs font-semibold cursor-pointer transition-all"
              >
                {saveState === "saving"
                  ? isEn ? "Saving…" : "Guardando…"
                  : isEn ? "Save changes" : "Guardar cambios"}
              </button>
              {saveState === "saved" && (
                <p className="text-[11px] text-emerald-700">{isEn ? "Saved and live." : "Guardado y publicado."}</p>
              )}
              {saveState === "error" && (
                <p className="text-[11px] text-red-600">
                  {isEn ? "Could not save. Check the values and try again." : "No se pudo guardar. Revisa los valores e inténtalo de nuevo."}
                </p>
              )}
            </div>
          ) : !PAYMENTS_ENABLED ? (
            <WaitlistForm lang={lang} source="studio" />
          ) : (
            <>
          {/* Hosted, permanent e-label (paid) */}
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 space-y-2.5">
            <p className="text-xs font-semibold text-emerald-900">
              {isEn
                ? "Need a permanent, editable e-label?"
                : "¿Necesitas una e-label permanente y editable?"}
            </p>
            <p className="text-[11px] text-emerald-900/80 leading-relaxed">
              {isEn
                ? "We host it for a year at a stable address, so the QR you print never breaks."
                : "La alojamos un año en una dirección estable, para que el QR que imprimas no deje de funcionar."}
            </p>
            <input
              type="email"
              value={publishEmail}
              onChange={(e) => setPublishEmail(e.target.value)}
              placeholder={isEn ? "Your email" : "Tu email"}
              className="w-full h-9 px-3 rounded-lg border border-neutral-200 bg-white text-xs"
            />
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing}
              className="w-full h-10 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-60 text-white text-xs font-semibold cursor-pointer transition-all"
            >
              {publishing
                ? isEn ? "Redirecting…" : "Redirigiendo…"
                : isEn ? "Publish hosted e-label" : "Publicar e-label alojada"}
            </button>
            {publishError && <p className="text-[11px] text-red-600">{publishError}</p>}
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
