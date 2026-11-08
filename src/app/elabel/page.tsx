"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ELabelView, type Lang } from "@/components/ELabelView";

/**
 * Legacy / demo viewer: reads the e-label data from the query string.
 * Kept so already-printed QR codes and the in-studio preview keep working.
 * Hosted, editable e-labels live at /e/[id].
 */
function ELabelQueryViewer() {
  const sp = useSearchParams();
  const urlLang = sp.get("lang");
  const initialLang: Lang =
    urlLang === "es" || urlLang === "fr" || urlLang === "de" || urlLang === "it"
      ? urlLang
      : "en";

  const data = {
    name: sp.get("name") || "Viña Pedrosa Reserva",
    year: sp.get("year") || "2024",
    appellation: sp.get("do") || "D.O.Ca. Rioja",
    abv: sp.get("abv") || "14",
    kj: sp.get("kj") || "334",
    kcal: sp.get("kcal") || "80",
    carbs: sp.get("carbs") || "0.9",
    sugars: sp.get("sugars") || "0.2",
    sulfites: sp.get("sulfites") !== "0",
    egg: sp.get("egg") === "1",
    milk: sp.get("milk") === "1",
    org: sp.get("org") === "1",
  };

  const qrUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://nutrilabel-eu.vercel.app/elabel?${sp.toString()}`;

  return <ELabelView data={data} qrUrl={qrUrl} initialLang={initialLang} />;
}

export default function WineELabelPublicPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-xs text-neutral-500">
          Loading…
        </div>
      }
    >
      <ELabelQueryViewer />
    </Suspense>
  );
}
