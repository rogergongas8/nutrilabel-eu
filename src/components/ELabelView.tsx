"use client";

import React, { useState, useMemo } from "react";
import { ShieldCheck, Globe, ArrowLeft, QrCode } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { generateQRMatrix } from "@/lib/qr-encoder";

export type Lang = "es" | "en" | "fr" | "de" | "it";

const TRANSLATIONS: Record<
  Lang,
  {
    badge: string;
    bottleQrTitle: string;
    scanNotice: string;
    nutritionTitle: string;
    avgValues: string;
    per100ml: string;
    energy: string;
    carbs: string;
    sugars: string;
    negligible: string;
    ingredientsTitle: string;
    grapes: string;
    organicGrapes: string;
    acidity: string;
    sulfites: string;
    egg: string;
    milk: string;
    atmosphere: string;
    cookieFreeNotice: string;
    backLink: string;
  }
> = {
  es: {
    badge: "E-LABEL OFICIAL REGLAMENTO (UE) 2021/2117",
    bottleQrTitle: "Código QR para etiqueta de botella",
    scanNotice: "Escanea con la cámara de tu móvil para verificar",
    nutritionTitle: "INFORMACIÓN NUTRICIONAL",
    avgValues: "Valores medios",
    per100ml: "Por 100 ml",
    energy: "Valor energético",
    carbs: "Hidratos de carbono",
    sugars: "de los cuales azúcares",
    negligible:
      "Contiene cantidades insignificantes de grasas, ácidos grasos saturados, proteínas y sal.",
    ingredientsTitle: "LISTA DE INGREDIENTES",
    grapes: "Uvas",
    organicGrapes: "Uvas ecológicas certificadas",
    acidity: "correctores de la acidez (ácido tartárico)",
    sulfites: "conservador y antioxidante: DIÓXIDO DE AZUFRE (SULFITOS) (E-220)",
    egg: "agente de clarificación: ALBÚMINA DE HUEVO",
    milk: "agente de clarificación: CASEÍNA LÁCTEA",
    atmosphere: "Envasado en atmósfera protectora.",
    cookieFreeNotice:
      "Página exenta de cookies de rastreo, analítica comercial y fines publicitarios en cumplimiento estricto del Artículo 119 del Reglamento (UE) Nº 1308/2013.",
    backLink: "Volver a NutriLabel Studio",
  },
  en: {
    badge: "OFFICIAL EU E-LABEL REGULATION (EU) 2021/2117",
    bottleQrTitle: "Wine bottle physical QR code",
    scanNotice: "Scan with your phone camera to test live resolution",
    nutritionTitle: "NUTRITION DECLARATION",
    avgValues: "Average values",
    per100ml: "Per 100 ml",
    energy: "Energy",
    carbs: "Carbohydrates",
    sugars: "of which sugars",
    negligible:
      "Contains negligible amounts of fat, saturates, protein and salt.",
    ingredientsTitle: "LIST OF INGREDIENTS",
    grapes: "Grapes",
    organicGrapes: "Certified organic grapes",
    acidity: "acidity regulators (tartaric acid)",
    sulfites: "preservative and antioxidant: SULPHUR DIOXIDE (SULPHITES) (E-220)",
    egg: "fining agent: EGG ALBUMIN",
    milk: "fining agent: MILK CASEIN",
    atmosphere: "Bottled in a protective atmosphere.",
    cookieFreeNotice:
      "Zero tracking cookies, zero user profiling, and zero marketing scripts in strict compliance with Article 119 of Regulation (EU) No 1308/2013.",
    backLink: "Back to NutriLabel Studio",
  },
  fr: {
    badge: "E-LABEL OFFICIEL RÈGLEMENT (UE) 2021/2117",
    bottleQrTitle: "Code QR imprimé sur la bouteille",
    scanNotice: "Scannez avec votre téléphone pour tester",
    nutritionTitle: "DÉCLARATION NUTRITIONNELLE",
    avgValues: "Valeurs moyennes",
    per100ml: "Pour 100 ml",
    energy: "Valeur énergétique",
    carbs: "Glucides",
    sugars: "dont sucres",
    negligible:
      "Contient des quantités négligeables de matières grasses, d'acides gras saturés, de protéines et de sel.",
    ingredientsTitle: "LISTE DES INGRÉDIENTS",
    grapes: "Raisins",
    organicGrapes: "Raisins biologiques certifiés",
    acidity: "correcteurs d'acidité (acide tartrique)",
    sulfites: "conservateur et antioxydant : DIOXYDE DE SOUFRE (SULFITES) (E-220)",
    egg: "agent de collage : ALBUMINE D'ŒUF",
    milk: "agent de collage : CASÉINE DE LAIT",
    atmosphere: "Conditionné sous atmosphère protectrice.",
    cookieFreeNotice:
      "Page sans cookies de suivi ni scripts publicitaires conformément à l'article 119 du règlement (UE) n° 1308/2013.",
    backLink: "Retour à NutriLabel Studio",
  },
  de: {
    badge: "OFFIZIELLES EU E-LABEL VERORDNUNG (EU) 2021/2117",
    bottleQrTitle: "Flaschen-QR-Code",
    scanNotice: "Mit der Handykamera scannen zum Testen",
    nutritionTitle: "NÄHRWERTDEKLARATION",
    avgValues: "Durchschnittliche Nährwerte",
    per100ml: "Je 100 ml",
    energy: "Brennwert",
    carbs: "Kohlenhydrate",
    sugars: "davon Zucker",
    negligible:
      "Enthält geringfügige Mengen von Fett, gesättigten Fettsäuren, Eiweiß und Salz.",
    ingredientsTitle: "ZUTATENVERZEICHNIS",
    grapes: "Trauben",
    organicGrapes: "Aus zertifizierten Bio-Trauben",
    acidity: "Säureregulatoren (Weinsäure)",
    sulfites: "Konservierungsstoff: SCHWEFELDIOXID (SULFITE) (E-220)",
    egg: "Klärungsmittel: EIALBUMIN",
    milk: "Klärungsmittel: MILCHKASEIN",
    atmosphere: "Unter Schutzatmosphäre abgefüllt.",
    cookieFreeNotice:
      "Tracking-freie Seite ohne Cookies und Marketing-Skripte gemäß Artikel 119 der Verordnung (EU) Nr. 1308/2013.",
    backLink: "Zurück zu NutriLabel Studio",
  },
  it: {
    badge: "E-LABEL UFFICIALE REGOLAMENTO (UE) 2021/2117",
    bottleQrTitle: "Codice QR per bottiglia",
    scanNotice: "Inquadra con la fotocamera del cellulare",
    nutritionTitle: "DICHIARAZIONE NUTRIZIONALE",
    avgValues: "Valori medi",
    per100ml: "Per 100 ml",
    energy: "Valore energetico",
    carbs: "Carboidrati",
    sugars: "di cui zuccheri",
    negligible:
      "Contiene quantità trascurabili di grassi, acidi grassi saturi, proteine e sale.",
    ingredientsTitle: "ELENCO DEGLI INGREDIENTI",
    grapes: "Uve",
    organicGrapes: "Uve biologiche certificate",
    acidity: "correttori di acidità (acido tartarico)",
    sulfites: "conservante e antiossidante: ANIDRIDE SOLFOROSA (SOLFITI) (E-220)",
    egg: "agente chiarificante: ALBUMINA D'UOVO",
    milk: "agente chiarificante: CASEINA DEL LATTE",
    atmosphere: "Imbottigliato in atmosfera protettiva.",
    cookieFreeNotice:
      "Pagina priva di cookie di tracciamento o script pubblicitari ai sensi dell'articolo 119 del regolamento (UE) n. 1308/2013.",
    backLink: "Torna a NutriLabel Studio",
  },
};

export interface ELabelViewData {
  name: string;
  year: string;
  appellation: string;
  abv: string;
  kj: string;
  kcal: string;
  carbs: string;
  sugars: string;
  sulfites: boolean;
  egg: boolean;
  milk: boolean;
  org: boolean;
}

export function ELabelView({
  data,
  qrUrl,
  initialLang = "en",
  backHref = "/",
}: {
  data: ELabelViewData;
  /** Canonical URL encoded in the bottle QR. Pass the stable public URL. */
  qrUrl: string;
  initialLang?: Lang;
  backHref?: string;
}) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const { name, year, appellation, abv, kj, kcal, carbs, sugars, sulfites, egg, milk, org } = data;

  const t = TRANSLATIONS[lang];

  const qrMatrix = useMemo(() => generateQRMatrix(qrUrl), [qrUrl]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 py-10 px-4 flex flex-col items-center justify-center font-sans">
      <div className="max-w-md w-full space-y-4">
        {/* Top Header with Brand Logo */}
        <div className="flex items-center justify-between px-1">
          <Link href="/" className="hover:opacity-85 transition-opacity">
            <BrandLogo size="sm" />
          </Link>
          <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            0% Cookies
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-2xs space-y-5">
          {/* Language Switcher Bar */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>EU 24 Languages</span>
            </div>
            <div className="flex rounded-lg bg-neutral-100 p-0.5 text-[11px] font-medium">
              {(["en", "es", "fr", "de", "it"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-md uppercase cursor-pointer transition-colors ${
                    lang === l
                      ? "bg-emerald-600 text-white font-semibold shadow-2xs"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Wine Identity */}
          <div>
            <span className="inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 mb-1.5">
              {t.badge}
            </span>
            <h1 className="text-xl font-bold text-neutral-900">
              {name} ({year})
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              {appellation} · {abv}% vol · 750 ml
            </p>
          </div>

          {/* Prominent Scannable Bottle QR Code */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-2">
              <QrCode className="w-3.5 h-3.5" />
              <span>{t.bottleQrTitle}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-neutral-200/80 shadow-2xs">
              <svg
                viewBox={`0 0 ${qrMatrix.size + 4} ${qrMatrix.size + 4}`}
                className="w-36 h-36"
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

            <p className="mt-2 text-[11px] text-neutral-500">
              {t.scanNotice}
            </p>
            <p className="mt-1 font-mono text-xs font-bold text-neutral-900">
              E = {kj} kJ / {kcal} kcal (100 ml)
            </p>
          </div>

          {/* Official Nutrition Table per 100 ml */}
          <div className="rounded-xl bg-neutral-50 border border-neutral-200/80 p-4">
            <h2 className="text-xs font-bold uppercase text-neutral-900 border-b border-neutral-200/80 pb-2 mb-2">
              {t.nutritionTitle}
            </h2>
            <table className="w-full text-xs divide-y divide-neutral-200/60">
              <thead>
                <tr className="font-semibold text-neutral-500 text-left">
                  <th className="py-1.5">{t.avgValues}</th>
                  <th className="py-1.5 text-right">{t.per100ml}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60">
                <tr className="font-medium text-neutral-900">
                  <td className="py-2">{t.energy}</td>
                  <td className="py-2 text-right font-bold text-emerald-800">
                    {kj} kJ / {kcal} kcal
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 font-medium text-neutral-700">{t.carbs}</td>
                  <td className="py-1.5 text-right text-neutral-900">{carbs} g</td>
                </tr>
                <tr>
                  <td className="py-1.5 pl-3 text-neutral-500">{t.sugars}</td>
                  <td className="py-1.5 text-right text-neutral-900">{sugars} g</td>
                </tr>
                <tr>
                  <td colSpan={2} className="py-2 text-[11px] text-neutral-400 italic">
                    {t.negligible}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Ingredients & Allergens */}
          <div className="pt-2 text-xs">
            <h3 className="font-semibold text-neutral-900 mb-1">
              {t.ingredientsTitle}:
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              {org ? t.organicGrapes : t.grapes}, {t.acidity}
              {sulfites && (
                <>
                  , <strong className="font-semibold text-neutral-900 underline">{t.sulfites}</strong>
                </>
              )}
              {egg && (
                <>
                  , <strong className="font-semibold text-neutral-900 underline">{t.egg}</strong>
                </>
              )}
              {milk && (
                <>
                  , <strong className="font-semibold text-neutral-900 underline">{t.milk}</strong>
                </>
              )}
              . {t.atmosphere}
            </p>
          </div>

          {/* Zero Cookie Compliance Notice */}
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70 flex items-start gap-2.5 text-[11px] text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>{t.cookieFreeNotice}</span>
          </div>

          <div className="pt-1 text-center">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.backLink}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
