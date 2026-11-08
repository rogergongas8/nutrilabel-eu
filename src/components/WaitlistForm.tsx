"use client";

import React, { useState } from "react";

type L = "en" | "es";

const T = {
  en: {
    title: "Get notified when hosted e-labels open",
    sub: "Free to join. We will only email you about the launch.",
    email: "Your email",
    ask: "What would you prefer?",
    opts: [
      ["one_time", "Pay once per label"],
      ["annual", "Annual plan for all my labels"],
      ["unsure", "Not sure yet"],
    ],
    send: "Notify me",
    sending: "Sending…",
    done: "Done. We will email you when it opens.",
    error: "Something went wrong. Check your email and try again.",
  },
  es: {
    title: "Avísame cuando abran las e-labels alojadas",
    sub: "Es gratis. Solo te escribiremos para avisarte del lanzamiento.",
    email: "Tu email",
    ask: "¿Qué preferirías?",
    opts: [
      ["one_time", "Pagar una vez por etiqueta"],
      ["annual", "Plan anual para todas mis etiquetas"],
      ["unsure", "Aún no lo sé"],
    ],
    send: "Avisarme",
    sending: "Enviando…",
    done: "Listo. Te escribiremos cuando abra.",
    error: "Algo falló. Revisa el email e inténtalo de nuevo.",
  },
} as const;

/** Contact for data requests. The form stays hidden until it is configured (GDPR: say who holds the email). */
const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export function WaitlistForm({ lang, source }: { lang: L; source: string }) {
  const t = T[lang];
  const [email, setEmail] = useState("");
  const [pref, setPref] = useState("one_time");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, preference: pref, lang, source, website }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (!CONTACT) return null;

  if (state === "done") {
    return <p className="text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-4">{t.done}</p>;
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 space-y-3">
      <div>
        <p className="text-sm font-semibold text-emerald-900">{t.title}</p>
        <p className="text-[11px] text-emerald-900/80 mt-0.5">{t.sub}</p>
      </div>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.email}
        className="w-full h-10 px-3 rounded-lg border border-neutral-200 bg-white text-sm"
      />
      <fieldset className="space-y-1.5">
        <legend className="text-[11px] font-medium text-neutral-600 mb-1">{t.ask}</legend>
        {t.opts.map(([value, label]) => (
          <label key={value} className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
            <input type="radio" name="pref" value={value} checked={pref === value} onChange={() => setPref(value)} />
            {label}
          </label>
        ))}
      </fieldset>
      {/* Honeypot: hidden from people, visible to bots */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="w-full h-10 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-60 text-white text-sm font-semibold cursor-pointer transition-colors"
      >
        {state === "sending" ? t.sending : t.send}
      </button>
      <p className="text-[10px] text-neutral-500 leading-snug">
        {lang === "es"
          ? `Usaremos tu email solo para avisarte del lanzamiento. Para borrarlo o consultar tus datos, escribe a ${CONTACT}.`
          : `We will use your email only to tell you about the launch. To delete it or ask about your data, write to ${CONTACT}.`}
      </p>
      {state === "error" && <p className="text-[11px] text-red-600">{t.error}</p>}
    </form>
  );
}
