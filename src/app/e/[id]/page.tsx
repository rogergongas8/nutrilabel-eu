import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { ELabelView, type Lang } from "@/components/ELabelView";
import { getStore } from "@/lib/elabel-store";
import { calculateWineNutrition } from "@/lib/wine-calculator";
import { siteOrigin } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

const LANGS: Lang[] = ["es", "en", "fr", "de", "it"];

export default async function HostedELabelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const label = await getStore().get(id);
  if (!label || label.status !== "active") notFound();

  const accept = (await headers()).get("accept-language") ?? "";
  const initialLang = LANGS.find((l) => accept.toLowerCase().startsWith(l)) ?? "en";

  // Energy is always recomputed from the stored inputs, never trusted from the client.
  const { per100ml } = calculateWineNutrition(label.wine);
  const w = label.wine;

  return (
    <ELabelView
      initialLang={initialLang}
      qrUrl={`${siteOrigin()}/e/${id}`}
      data={{
        name: w.wineName,
        year: w.vintageYear,
        appellation: w.appellation,
        abv: String(w.abvPercent),
        kj: String(per100ml.energyKj),
        kcal: String(per100ml.energyKcal),
        carbs: String(per100ml.carbs),
        sugars: String(per100ml.sugars),
        sulfites: w.containsSulfites,
        egg: w.containsEggAlbumin,
        milk: w.containsMilkCasein,
        org: w.isOrganic,
      }}
    />
  );
}
