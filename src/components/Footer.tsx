"use client";

import React, { useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type LegalDocKey = "terminos" | "exencion" | "privacidad" | null;

export const Footer: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<LegalDocKey>(null);

  return (
    <footer className="bg-[#111613] text-[#F6F3EC] pt-12 pb-12 border-t-2 border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Collapsible SEO & GEO Regulatory Knowledge Base */}
        <section id="preguntas-normativas" className="mb-12 pb-10 border-b border-[#F6F3EC]/15">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold block mb-1">
            GUÍA RÁPIDA DE CUMPLIMIENTO LEGAL (UE 1169/2011 Y VINOS 2021/2117)
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F6F3EC] mb-4">
            Preguntas Frecuentes sobre Etiquetado Nutricional e Inspección de Sanidad
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <details className="bg-[#19211D] border border-[#F6F3EC]/15 p-4 group">
              <summary className="font-bold text-[#F6F3EC] cursor-pointer list-none flex items-center justify-between gap-2">
                <span>¿Es 100% legal calcular la etiqueta sin ir al laboratorio?</span>
                <span className="text-accent font-mono">+</span>
              </summary>
              <p className="mt-2.5 text-[#F6F3EC]/75 leading-relaxed">
                Sí. El <strong>Artículo 31.4 del Reglamento (UE) Nº 1169/2011</strong> autoriza expresamente calcular los valores nutricionales a partir de bases de datos oficiales reconocidas (como <strong>BEDCA</strong> en España y <strong>USDA</strong>) sin obligación de realizar análisis químicos de laboratorio para alimentos homogéneos.
              </p>
            </details>

            <details className="bg-[#19211D] border border-[#F6F3EC]/15 p-4 group">
              <summary className="font-bold text-[#F6F3EC] cursor-pointer list-none flex items-center justify-between gap-2">
                <span>¿Por qué es obligatorio aplicar la merma de cocción?</span>
                <span className="text-accent font-mono">+</span>
              </summary>
              <p className="mt-2.5 text-[#F6F3EC]/75 leading-relaxed">
                Al hornear galletas, pan o cocer una mermelada se evapora agua. Como la etiqueta nutricional declara los valores por cada <strong>100 g de producto terminado</strong>, descontar la pérdida de humedad evita desviaciones frente a la Guía de Tolerancias (±20%) de Sanidad.
              </p>
            </details>

            <details className="bg-[#19211D] border border-[#F6F3EC]/15 p-4 group">
              <summary className="font-bold text-[#F6F3EC] cursor-pointer list-none flex items-center justify-between gap-2">
                <span>¿Qué exige la ley de etiquetas QR de Vinos (UE 2021/2117)?</span>
                <span className="text-accent font-mono">+</span>
              </summary>
              <p className="mt-2.5 text-[#F6F3EC]/75 leading-relaxed">
                Obliga a imprimir en la botella el valor energético (<code>E = kJ/kcal por 100 ml</code>) y los alérgenos (sulfitos), permitiendo mostrar la tabla nutricional completa e ingredientes mediante un código QR cuya web no rastree al usuario con cookies ni publicidad.
              </p>
            </details>
          </div>
        </section>

        {/* Multi-Column Editorial Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12">
          {/* Column 1 (4 Cols): Brand Identity & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center bg-accent text-white font-mono text-xs font-bold">
                NL
              </div>
              <span className="font-display text-2xl font-bold text-[#F6F3EC]">
                NutriLabel
              </span>
            </div>
            <p className="text-sm text-[#F6F3EC]/70 leading-relaxed max-w-sm">
              Ingeniería de etiquetado nutricional normativo y trazabilidad de alérgenos para obradores artesanales, industria alimentaria e imprentas de packaging.
            </p>
            <div className="font-mono text-xs text-accent pt-1">
              ESTÁNDAR TÉCNICO: DOUE L 304/18 · ART. 31.4
            </div>
          </div>

          {/* Column 2 (3 Cols): Navegación y Herramientas */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
              Plataforma Técnica
            </h3>
            <ul className="space-y-2.5 text-sm text-[#F6F3EC]/80">
              <li>
                <a href="#estudio-calculo" className="hover:text-white transition-colors">
                  Mesa de Formulación Interactiva
                </a>
              </li>
              <li>
                <a href="#ventajas-legales" className="hover:text-white transition-colors">
                  Justificación Artículo 31.4 UE
                </a>
              </li>
              <li>
                <a href="#casos-reales" className="hover:text-white transition-colors">
                  Expedientes de Obradores
                </a>
              </li>
              <li>
                <a href="#preguntas-normativas" className="hover:text-white transition-colors">
                  Guía de Inspección Sanitaria
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 (3 Cols): Fuentes Científicas y Normativa */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
              Fuentes Oficiales
            </h3>
            <ul className="space-y-2.5 text-sm text-[#F6F3EC]/80 font-mono text-xs">
              <li>BEDCA / Ministerio de Sanidad</li>
              <li>AESAN / Seguridad Alimentaria</li>
              <li>USDA FoodData Central (SR Legacy)</li>
              <li>Reglamento (UE) Nº 1169/2011</li>
              <li>FDA 21 CFR Part 101.9</li>
            </ul>
          </div>

          {/* Column 4 (2 Cols): Páginas Legales y Contacto */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-accent">
              Marco Jurídico
            </h3>
            <ul className="space-y-2.5 text-sm text-[#F6F3EC]/80">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveDoc("terminos")}
                  className="hover:text-accent underline text-left cursor-pointer"
                >
                  Términos de Servicio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveDoc("exencion")}
                  className="hover:text-accent underline text-left cursor-pointer"
                >
                  Cláusula Art. 31.4 UE
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveDoc("privacidad")}
                  className="hover:text-accent underline text-left cursor-pointer"
                >
                  Política de Privacidad
                </button>
              </li>
              <li className="pt-2 font-mono text-xs text-[#F6F3EC]/60">
                soporte@nutrilabel.eu
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-[#F6F3EC]/15 my-6" />

        {/* Mandatory Legal Shield Box (Permanent Visible Disclaimer) */}
        <div className="p-5 bg-[#19211D] border border-[#F6F3EC]/15 text-xs text-[#F6F3EC]/75 leading-relaxed mb-8">
          <div className="flex items-center gap-2 text-[#F6F3EC] font-mono font-bold text-xs mb-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>
              DECLARACIÓN DE CONFORMIDAD Y DESLINDE DE RESPONSABILIDAD DEL OPERADOR ALIMENTARIO
            </span>
          </div>
          <p>
            NutriLabel realiza cálculos teóricos ponderados de información nutricional conforme al{" "}
            <strong>Artículo 31, apartado 4, letra c) del Reglamento (UE) Nº 1169/2011</strong> del Parlamento Europeo y del Consejo, utilizando valores medios procedentes de bases de datos públicas reconocidas (Base de Datos Española de Composición de Alimentos - BEDCA y USDA FoodData Central). Conforme al Artículo 8 del citado Reglamento, el operador de la empresa alimentaria bajo cuyo nombre o razón social se comercializa el alimento es el responsable último de verificar la exactitud de los pesos en crudo, los porcentajes de merma térmica por horneado/cocción y las fichas técnicas de alérgenos cruzados de sus proveedores. Este software constituye una herramienta de cálculo teórico asistido y no equivale a un boletín analítico físico-químico emitido por laboratorio acreditado ENAC.
          </p>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#F6F3EC]/50 gap-4">
          <p>© {new Date().getFullYear()} NutriLabel Studio. Todos los derechos reservados.</p>
          <p>DISEÑO TÉCNICO SUIZO · PRECISIÓN NORMATIVA EUROPEA</p>
        </div>
      </div>

      {/* Legal Document Modal */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F6F3EC] text-ink border-2 border-primary max-w-2xl w-full p-6 sm:p-8 shadow-tactile relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-primary pb-4 mb-5">
              <h4 className="font-display text-2xl font-bold text-primary">
                {activeDoc === "terminos" && "Términos y Condiciones de Uso"}
                {activeDoc === "exencion" &&
                  "Amparo Jurídico Art. 31.4 y Limitación de Responsabilidad"}
                {activeDoc === "privacidad" && "Política de Privacidad y Tratamiento Local"}
              </h4>
              <button
                type="button"
                onClick={() => setActiveDoc(null)}
                className="p-1.5 border border-primary text-primary hover:bg-primary hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-ink/90 leading-relaxed">
              {activeDoc === "terminos" && (
                <>
                  <p>
                    <strong>1. Objeto del Servicio:</strong> NutriLabel proporciona una estación de cálculo matemático ponderado para la elaboración de tablas de información nutricional y listado de ingredientes conforme al Reglamento (UE) Nº 1169/2011.
                  </p>
                  <p>
                    <strong>2. Deber de Verificación del Operador:</strong> El usuario declara ser un operador alimentario, técnico de calidad o diseñador profesional y se compromete a contrastar que las materias primas empleadas en su obrador coinciden con la naturaleza de los ingredientes base seleccionados (ej. porcentaje de materia grasa en mantequillas o natas).
                  </p>
                  <p>
                    <strong>3. Límite de Responsabilidad:</strong> La responsabilidad máxima de NutriLabel ante cualquier reclamación derivada del uso de las plantillas o cálculos queda limitada al importe efectivamente abonado por el usuario por la licencia o descarga del archivo.
                  </p>
                </>
              )}

              {activeDoc === "exencion" && (
                <>
                  <p>
                    <strong>Amparo Legal Europeo:</strong> El Artículo 31.4 del Reglamento (UE) Nº 1169/2011 autoriza expresamente que los valores declarados en el envase sean valores medios obtenidos mediante cálculo a partir de datos generalmente establecidos y aceptados.
                  </p>
                  <p>
                    <strong>Guía de Tolerancias de la Comisión Europea:</strong> Los controles oficiales de las autoridades sanitarias aplican la Guía de Tolerancias de diciembre de 2012, que contempla desviaciones admisibles de hasta un ±20% (o ±2 g / ±4 g según tramo) para absorber las variaciones naturales de las cosechas y procesos artesanales.
                  </p>
                </>
              )}

              {activeDoc === "privacidad" && (
                <>
                  <p>
                    <strong>Secreto Industrial de tus Recetas:</strong> Todos los cálculos de formulación, pesos en gramos y porcentajes de tu escandallo se ejecutan directamente en la memoria local de tu navegador. NutriLabel no almacena ni comparte las fórmulas secretas de tu obrador con terceros.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
