import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { WineELabelStudio } from "@/components/WineELabelStudio";
import { getStore, tokenMatches } from "@/lib/elabel-store";
import { siteOrigin } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function EditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { id } = await params;
  const { t } = await searchParams;
  const label = await getStore().get(id);
  if (!label || !t || !tokenMatches(t, label.editTokenHash)) notFound();

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <WineELabelStudio
          lang="es"
          edit={{ id, token: t, publicUrl: `${siteOrigin()}/e/${id}`, initialWine: label.wine }}
        />
      </div>
    </main>
  );
}
