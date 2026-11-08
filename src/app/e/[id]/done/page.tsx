import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStore, tokenMatches } from "@/lib/elabel-store";
import { siteOrigin } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function DonePage({
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

  const publicUrl = `${siteOrigin()}/e/${id}`;
  const active = label.status === "active";

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-4 py-12 flex justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl border border-neutral-200/90 p-6 space-y-4 text-sm">
        <h1 className="text-lg font-bold text-neutral-900">
          {active ? "E-label publicada" : "Procesando el pago…"}
        </h1>
        {active ? (
          <>
            <p className="text-neutral-600">
              Esta es la dirección permanente de tu e-label. Es la que debe ir en el QR de la botella:
            </p>
            <a className="block break-all font-mono text-emerald-700 underline" href={publicUrl}>
              {publicUrl}
            </a>
            <p className="text-neutral-600">
              Guarda este enlace privado: es la única forma de gestionar tu e-label. No lo compartas.
            </p>
            <code className="block break-all rounded-lg bg-neutral-100 p-2 text-xs">
              {siteOrigin()}/e/{id}/edit?t={t}
            </code>
            <a
              className="inline-block rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white"
              href={`/e/${id}/edit?t=${t}`}
            >
              Editar e-label
            </a>
          </>
        ) : (
          <p className="text-neutral-600">
            Stripe nos está confirmando el pago. Recarga esta página en unos segundos.
          </p>
        )}
      </div>
    </main>
  );
}
