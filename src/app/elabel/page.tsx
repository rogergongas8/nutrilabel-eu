"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Wine, Globe, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Lang = "es" | "en" | "fr" | "de" | "it";

const TRANSLATIONS: Record<
  Lang,
  {
    badge: string;
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
  }
> = {
  es: {
    badge: "E-LABEL OFICIAL REGLAMENTO (UE) 2021/2117",
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
  },
  en: {
    badge: "OFFICIAL EU E-LABEL REGULATION (EU) 2021/2117",
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
  },
  fr: {
    badge: "E-LABEL OFFICIEL RÈGLEMENT (UE) 2021/2117",
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
  },
  de: {
    badge: "OFFIZIELLES EU E-LABEL VERORDNUNG (EU) 2021/2117",
    nutritionTitle: "NÄHRWERTDEKLARATION",
    avgValues: "Durchschnittliche Nährwerte",
    per100ml: "Je 100 ml",
    energy: "Brennwert",
    carbs: "Kohlenhydrate",
    sugars: "davon Zucker",
    negligible:
      "Enthält geringfügige Mengen von Fett, gesättigten Fettsäuren, Eiweiß und Salz.",
    ingredientsTitle: "ZUTATENVERZEICHNIS",
    grapes: "Weintrauben",
    organicGrapes: "Zertifizierte Bio-Weintrauben",
    acidity: "Säureregulatoren (Weinsäure)",
    sulfites: "Konservierungsstoff: SCHWEFELDIOXID (SULFITE) (E-220)",
    egg: "Schönungsmittel: EIALBUMIN",
    milk: "Schönungsmittel: MILCHKASEIN",
    atmosphere: "Unter Schutzatmosphäre abgefüllt.",
    cookieFreeNotice:
      "Keine Tracking-Cookies oder Werbeskripte gemäß Artikel 119 der Verordnung (EU) Nr. 1308/2013.",
  },
  it: {
    badge: "E-LABEL UFFICIALE REGOLAMENTO (UE) 2021/2117",
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
  },
};

function ELabelViewerContent() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<Lang>("es");

  const name = searchParams.get("name") || "Viña Pedrosa Reserva";
  const year = searchParams.get("year") || "2024";
  const appellation = searchParams.get("do") || "D.O.Ca. Rioja";
  const abv = searchParams.get("abv") || "14";
  const kj = searchParams.get("kj") || "334";
  const kcal = searchParams.get("kcal") || "80";
  const carbs = searchParams.get("carbs") || "0.9";
  const sugars = searchParams.get("sugars") || "0.2";
  const sulfites = searchParams.get("sulfites") !== "0";
  const egg = searchParams.get("egg") === "1";
  const milk = searchParams.get("milk") === "1";
  const org = searchParams.get("org") === "1";

  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#111613] py-8 px-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white border-2 border-[#111613] p-6 shadow-tactile space-y-5">
        {/* Language Bar */}
        <div className="flex items-center justify-between border-b border-[#111613]/20 pb-3">
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#143326]">
            <Globe className="w-3.5 h-3.5 text-[#D94E28]" />
            <span>EU 24 LANGUAGES READY</span>
          </div>
          <div className="flex border border-[#143326] font-mono text-[11px] font-bold">
            {(["es", "en", "fr", "de", "it"] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-2 py-0.5 uppercase cursor-pointer ${
                  lang === l
                    ? "bg-[#143326] text-white"
                    : "text-[#143326] hover:bg-[#143326]/10"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Wine Identity */}
        <div>
          <span className="inline-block font-mono text-[10px] font-bold uppercase px-2 py-0.5 bg-[#143326] text-[#F6F3EC]">
            {t.badge}
          </span>
          <h1 className="font-display text-2xl font-black text-[#111613] mt-2">
            {name} ({year})
          </h1>
          <p className="font-mono text-xs text-[#5A625E] mt-0.5">
            {appellation} · {abv}% vol · 750 ml
          </p>
        </div>

        {/* Official Nutrition Table per 100 ml */}
        <div className="border-2 border-[#111613] p-4">
          <h2 className="font-sans text-sm font-black uppercase border-b-2 border-[#111613] pb-1.5 mb-2">
            {t.nutritionTitle}
          </h2>
          <table className="w-full text-xs font-sans divide-y divide-[#111613]/20">
            <thead>
              <tr className="font-bold text-left">
                <th className="py-1.5">{t.avgValues}</th>
                <th className="py-1.5 text-right">{t.per100ml}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111613]/20">
              <tr className="font-bold">
                <td className="py-2">{t.energy}</td>
                <td className="py-2 text-right">
                  {kj} kJ / {kcal} kcal
                </td>
              </tr>
              <tr>
                <td className="py-1.5 font-bold">{t.carbs}</td>
                <td className="py-1.5 text-right font-bold">{carbs} g</td>
              </tr>
              <tr>
                <td className="py-1.5 pl-3 text-[#5A625E]">{t.sugars}</td>
                <td className="py-1.5 text-right">{sugars} g</td>
              </tr>
              <tr>
                <td colSpan={2} className="py-2 text-[11px] text-[#5A625E] italic">
                  {t.negligible}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Ingredients & Allergens */}
        <div className="border-t-2 border-[#111613] pt-3">
          <h3 className="font-sans text-xs font-black uppercase text-[#111613]">
            {t.ingredientsTitle}:
          </h3>
          <p className="text-xs leading-relaxed text-[#111613] mt-1">
            {org ? t.organicGrapes : t.grapes}, {t.acidity}
            {sulfites && (
              <>
                , <strong className="underline font-black">{t.sulfites}</strong>
              </>
            )}
            {egg && (
              <>
                , <strong className="underline font-black">{t.egg}</strong>
              </>
            )}
            {milk && (
              <>
                , <strong className="underline font-black">{t.milk}</strong>
              </>
            )}
            . {t.atmosphere}
          </p>
        </div>

        {/* Zero Cookie Compliance Notice */}
        <div className="p-3 bg-[#F6F3EC] border border-[#143326]/30 flex items-start gap-2.5 text-[11px] font-mono text-[#143326]">
          <ShieldCheck className="w-4 h-4 text-[#D94E28] shrink-0 mt-0.5" />
          <span>{t.cookieFreeNotice}</span>
        </div>

        <div className="pt-2 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#143326] hover:text-[#D94E28] underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Generador NutriLabel</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function WineELabelPublicPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F6F3EC] flex items-center justify-center font-mono text-xs">
          Cargando E-Label Oficial UE 2021/2117...
        </div>
      }
    >
      <ELabelViewerContent />
    </Suspense>
  );
}
