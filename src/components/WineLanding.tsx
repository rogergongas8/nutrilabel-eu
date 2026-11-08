import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Check, QrCode, FlaskConical, Languages, PencilLine } from "lucide-react";

type L = "en" | "es";

const COPY = {
  en: {
    nav: "Free calculator",
    badge: "Regulation (EU) 2021/2117",
    h1: "Free wine e-label and QR generator (EU 2021/2117)",
    sub: "Enter your lab values, get the energy per 100 ml and a ready-to-print QR for the ingredient and nutrition page your bottles must link to, in 5 languages.",
    cta: "Try it free",
    cta2: "See how it works",
    stepsTitle: "From lab sheet to QR in minutes",
    steps: [
      ["Enter your values", "Alcohol, residual sugar, acidity and glycerol. The energy per 100 ml (E = kJ / kcal) is calculated for you with the coefficients of Annex XIV of Regulation 1169/2011."],
      ["Preview the page", "See the exact page your customers will open when they scan the bottle, with allergens highlighted."],
      ["Download your QR", "Get the QR in print-ready vector format. Hosted pages with a permanent address and editing are coming."],
    ],
    featTitle: "What you get",
    feats: [
      [QrCode, "Permanent address (coming soon)", "Hosted pages with a fixed URL, so the QR you print never has to change."],
      [Languages, "5 languages", "English, Spanish, French, German and Italian, with the visitor's language detected automatically."],
      [FlaskConical, "Energy calculation", "Computed from your values, never typed by hand. Recalculated on our server every time the page loads."],
      [PencilLine, "Edit any time (coming soon)", "A private link to correct a value for a new vintage or a corrected analysis."],
    ],
    priceTitle: "Free for now",
    priceLine: "Calculator, preview and QR: free",
    priceNotes: ["No sign-up needed", "Hosted e-labels are being prepared", "Pricing is not decided yet: tell us what you would prefer"],
    faqTitle: "Questions",
    faq: [
      ["What does the regulation require?", "Since December 2023, wines produced from that date must give the ingredient list and nutrition declaration electronically, usually through a QR code, while some information (such as allergens and the energy value) must still appear on the physical label. Check the regulation or your regional authority for your exact case."],
      ["Does it work in any EU country?", "The page and the energy calculation follow the EU regulation and are not tied to one country. The page is available in 5 languages."],
      ["Who is responsible for the values?", "You are. We calculate from the values you enter. Make sure they come from your own analysis. This tool is not legal advice."],
      ["Is it free?", "Yes. The calculator, preview and QR download are free today. We are preparing hosted e-labels with a permanent address; pricing is not decided yet."],
    ],
    final: "Start with the free calculator. Hosted e-labels open soon.",
    disclaimer: "NutriLabel helps you calculate and publish. It is not legal advice and not an official or government service.",
  },
  es: {
    nav: "Calculadora gratis",
    badge: "Reglamento (UE) 2021/2117",
    h1: "Generador gratuito de e-label y QR para vino (UE 2021/2117)",
    sub: "Introduce tus valores de laboratorio y obtén la energía por 100 ml y un QR listo para imprimir hacia la ficha de ingredientes e información nutricional que deben enlazar tus botellas, en 5 idiomas.",
    cta: "Pruébalo gratis",
    cta2: "Ver cómo funciona",
    stepsTitle: "De la analítica al QR en minutos",
    steps: [
      ["Introduce tus valores", "Alcohol, azúcar residual, acidez y glicerol. La energía por 100 ml (E = kJ / kcal) se calcula con los coeficientes del Anexo XIV del Reglamento 1169/2011."],
      ["Mira la ficha", "Ves exactamente la página que abrirán tus clientes al escanear la botella, con los alérgenos resaltados."],
      ["Descarga tu QR", "Obtén el QR en vector listo para imprenta. Las fichas alojadas con dirección permanente y edición llegarán pronto."],
    ],
    featTitle: "Qué incluye",
    feats: [
      [QrCode, "Dirección permanente (próximamente)", "Fichas alojadas con URL fija, para que el QR que imprimes no tenga que cambiar nunca."],
      [Languages, "5 idiomas", "Inglés, español, francés, alemán e italiano, con detección automática del idioma del visitante."],
      [FlaskConical, "Cálculo de energía", "Se calcula a partir de tus valores, nunca a mano. Se recalcula en nuestro servidor cada vez que se carga la página."],
      [PencilLine, "Edita cuando quieras (próximamente)", "Un enlace privado para corregir un valor en una nueva añada o con una analítica corregida."],
    ],
    priceTitle: "Gratis por ahora",
    priceLine: "Calculadora, vista previa y QR: gratis",
    priceNotes: ["Sin registro", "Estamos preparando las e-labels alojadas", "El precio aún no está decidido: dinos qué preferirías"],
    faqTitle: "Preguntas",
    faq: [
      ["¿Qué exige la normativa?", "Desde diciembre de 2023, los vinos elaborados a partir de esa fecha deben ofrecer por medios electrónicos la lista de ingredientes y la declaración nutricional, normalmente mediante un QR, mientras que parte de la información (como los alérgenos y el valor energético) debe seguir en la etiqueta física. Consulta el reglamento o a tu autoridad regional para tu caso concreto."],
      ["¿Sirve para cualquier país de la UE?", "La ficha y el cálculo energético siguen el reglamento europeo y no dependen de un país. La página está disponible en 5 idiomas."],
      ["¿Quién responde de los valores?", "Tú. Calculamos con los valores que introduces; asegúrate de que salgan de tu propia analítica. Esta herramienta no es asesoramiento legal."],
      ["¿Es gratis?", "Sí. La calculadora, la vista previa y la descarga del QR son gratuitas hoy. Estamos preparando e-labels alojadas con dirección permanente; el precio aún no está decidido."],
    ],
    final: "Empieza con la calculadora gratuita. Las e-labels alojadas abren pronto.",
    disclaimer: "NutriLabel te ayuda a calcular y publicar. No es asesoramiento legal ni un servicio oficial o gubernamental.",
  },
} as const;

export function WineLanding({ lang }: { lang: L }) {
  const t = COPY[lang];
  const tool = `/?mode=wine&lang=${lang}`;
  const other = lang === "en" ? { href: "/es/etiqueta-electronica-vino", label: "ES" } : { href: "/wine-e-label", label: "EN" };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900">
      <header className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/"><BrandLogo size="sm" /></Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href={tool} className="text-neutral-600 hover:text-neutral-900">{t.nav}</Link>
          <Link href={other.href} className="text-xs font-semibold px-2 py-1 rounded-md bg-neutral-100 text-neutral-600">{other.label}</Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        <section className="py-16 md:py-24 max-w-3xl">
          <span className="fade-up inline-block text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{t.badge}</span>
          <h1 className="fade-up fade-up-2 mt-5 text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">{t.h1}</h1>
          <p className="fade-up fade-up-3 mt-5 text-lg text-neutral-600 leading-relaxed">{t.sub}</p>
          <div className="fade-up fade-up-3 mt-8 flex flex-wrap gap-3">
            <Link href={tool} className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold inline-flex items-center transition-colors">{t.cta}</Link>
            <a href="#how" className="h-11 px-6 rounded-xl bg-white border border-neutral-200 text-sm font-medium inline-flex items-center hover:bg-neutral-50 transition-colors">{t.cta2}</a>
          </div>
        </section>

        <section id="how" className="py-12 border-t border-neutral-200/80">
          <h2 className="text-2xl font-bold">{t.stepsTitle}</h2>
          <ol className="mt-8 grid md:grid-cols-3 gap-5">
            {t.steps.map(([title, body], i) => (
              <li key={title} className="bg-white rounded-2xl border border-neutral-200/90 p-6">
                <span className="w-7 h-7 rounded-full bg-neutral-900 text-white text-xs font-semibold inline-flex items-center justify-center">{i + 1}</span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-neutral-600 leading-relaxed">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="py-12 border-t border-neutral-200/80">
          <h2 className="text-2xl font-bold">{t.featTitle}</h2>
          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {t.feats.map(([Icon, title, body]) => (
              <div key={title as string} className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{title as string}</h3>
                  <p className="mt-1 text-sm text-neutral-600 leading-relaxed">{body as string}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 border-t border-neutral-200/80">
          <div className="max-w-md bg-white rounded-2xl border border-neutral-200/90 p-8">
            <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">{t.priceTitle}</h2>
            <p className="mt-3 text-3xl font-bold">{t.priceLine}</p>
            <ul className="mt-5 space-y-2 text-sm text-neutral-700">
              {t.priceNotes.map((n) => (
                <li key={n} className="flex gap-2"><Check className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" />{n}</li>
              ))}
            </ul>
            <div className="mt-6">
              {process.env.NEXT_PUBLIC_CONTACT_EMAIL ? (
                <WaitlistForm lang={lang} source="landing" />
              ) : (
                <Link href={tool} className="h-11 w-full rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold inline-flex items-center justify-center transition-colors">{t.cta}</Link>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 border-t border-neutral-200/80 max-w-3xl">
          <h2 className="text-2xl font-bold">{t.faqTitle}</h2>
          <div className="mt-6 divide-y divide-neutral-200/80">
            {t.faq.map(([q, a]) => (
              <details key={q} className="py-4 group">
                <summary className="cursor-pointer font-medium list-none flex justify-between">{q}<span className="text-neutral-400 group-open:rotate-45 transition-transform">+</span></summary>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="py-12 border-t border-neutral-200/80 text-center">
          <p className="text-lg font-medium">{t.final}</p>
          <Link href={tool} className="mt-5 h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold inline-flex items-center transition-colors">{t.cta}</Link>
        </section>
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-10 text-xs text-neutral-500">{t.disclaimer}</footer>
    </div>
  );
}
