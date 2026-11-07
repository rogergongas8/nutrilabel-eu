"use client";

import React from "react";
import { X, Printer, ShieldCheck, CheckCircle2 } from "lucide-react";
import { CalculationResult } from "@/types/nutrition";
import { Button } from "@/components/ui/button";

interface TechnicalSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculation: CalculationResult | null;
  productName?: string;
}

export const TechnicalSheetModal: React.FC<TechnicalSheetModalProps> = ({
  isOpen,
  onClose,
  calculation,
  productName = "Producto Alimentario Artesanal",
}) => {
  if (!isOpen || !calculation) return null;

  const handlePrint = () => {
    window.print();
  };

  const {
    technicalAuditSheet,
    per100g,
    finishedWeightGrams,
    rawWeightGrams,
    evaporationFactor,
  } = calculation;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#F6F3EC] border-2 border-primary max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-tactile text-ink">
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#F6F3EC] border-b-2 border-primary px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary text-[#F6F3EC] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-primary">
                Expediente Técnico de Trazabilidad para Inspección Sanitaria (APPCC)
              </h3>
              <p className="font-mono text-[11px] text-neutral uppercase">
                DOC-REF: UE-1169/2011-ART31.4 // VÁLIDO ANTE AUTORIDAD SANITARIA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" onClick={handlePrint}>
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir A4</span>
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 border border-primary text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Dossier Body */}
        <div className="p-6 sm:p-8 space-y-6 text-sm" id="printable-technical-sheet">
          {/* Official Normative Box */}
          <div className="p-5 bg-surface border-2 border-primary flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-accent">
                FUNDAMENTO JURÍDICO DEL CÁLCULO TEÓRICO
              </span>
              <h4 className="font-display text-lg font-bold text-primary mt-0.5">
                Reglamento (UE) Nº 1169/2011 — Artículo 31, Apartado 4, Letra c)
              </h4>
              <p className="text-xs text-neutral mt-1 leading-relaxed">
                «Los valores declarados serán valores medios que se basarán en el cálculo efectuado a partir de datos generalmente establecidos y aceptados (Base de Datos Española de Composición de Alimentos BEDCA / AECOSAN y USDA FoodData Central).»
              </p>
            </div>
            <span className="font-mono text-xs font-bold px-3 py-1 bg-primary text-[#F6F3EC] flex items-center gap-1.5 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              <span>CONFORME LEY</span>
            </span>
          </div>

          {/* Batch Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white border border-primary/30 font-mono text-xs">
            <div>
              <span className="text-neutral block text-[10px]">DENOMINACIÓN:</span>
              <strong className="text-primary text-sm">{productName}</strong>
            </div>
            <div>
              <span className="text-neutral block text-[10px]">MASA CRUDA LOTE:</span>
              <strong className="text-primary text-sm">{rawWeightGrams} g</strong>
            </div>
            <div>
              <span className="text-neutral block text-[10px]">MERMA COCCIÓN:</span>
              <strong className="text-accent text-sm">
                -{(evaporationFactor * 100).toFixed(0)}%
              </strong>
            </div>
            <div>
              <span className="text-neutral block text-[10px]">PESO TERMINADO:</span>
              <strong className="text-primary text-sm">
                {finishedWeightGrams.toFixed(0)} g
              </strong>
            </div>
          </div>

          {/* Ingredient Provenance Table */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-primary mb-2">
              1. Escandallo Ponderado y Procedencia Científica de Datos
            </h4>
            <div className="overflow-x-auto border-2 border-primary bg-white">
              <table className="w-full text-left text-xs divide-y divide-primary/20">
                <thead className="bg-[#EAE5D9] font-mono font-bold text-primary uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Materia Prima</th>
                    <th className="py-2.5 px-3">Código Oficial Acreditado</th>
                    <th className="py-2.5 px-3 text-right">Peso Crudo</th>
                    <th className="py-2.5 px-3 text-right">% Fórmula</th>
                    <th className="py-2.5 px-3">Alérgenos Anexo II</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10 font-mono">
                  {technicalAuditSheet.itemsBreakdown.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 font-sans font-bold text-primary">
                        {item.name}
                      </td>
                      <td className="py-2 px-3 text-neutral">{item.source}</td>
                      <td className="py-2 px-3 text-right font-bold text-primary">
                        {item.amountGrams} g
                      </td>
                      <td className="py-2 px-3 text-right text-neutral">
                        {item.percentageOfRecipe}%
                      </td>
                      <td className="py-2 px-3">
                        {item.allergens.length > 0 ? (
                          <span className="font-bold text-accent">
                            {item.allergens.join(", ")}
                          </span>
                        ) : (
                          <span className="text-neutral/60">Exento</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Final Declared Values per 100g */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-primary mb-2">
              2. Valores Nutricionales Medios Resultantes (Por 100 g de Producto Terminado)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 bg-white border border-primary/30">
                <span className="text-neutral block text-[10px]">VALOR ENERGÉTICO:</span>
                <strong className="text-primary">
                  {per100g.energyKj} kJ / {per100g.energyKcal} kcal
                </strong>
              </div>
              <div className="p-3 bg-white border border-primary/30">
                <span className="text-neutral block text-[10px]">GRASAS (SATURADAS):</span>
                <strong className="text-primary">
                  {per100g.fat} g ({per100g.saturatedFat} g)
                </strong>
              </div>
              <div className="p-3 bg-white border border-primary/30">
                <span className="text-neutral block text-[10px]">HIDRATOS (AZÚCARES):</span>
                <strong className="text-primary">
                  {per100g.carbs} g ({per100g.sugars} g)
                </strong>
              </div>
              <div className="p-3 bg-white border border-primary/30">
                <span className="text-neutral block text-[10px]">PROTEÍNAS / SAL:</span>
                <strong className="text-primary">
                  {per100g.protein} g / {per100g.salt} g
                </strong>
              </div>
            </div>
          </div>

          {/* Signature Box for Sanitary Inspector */}
          <div className="pt-6 border-t-2 border-primary flex flex-col sm:flex-row justify-between gap-6 text-xs">
            <div className="max-w-md">
              <p className="font-bold text-primary uppercase font-mono">
                Conformidad del Responsable de Calidad / Operador:
              </p>
              <p className="text-neutral mt-1 leading-snug">
                El operador certifica que las cantidades ponderadas corresponden fielmente al lote elaborado y se archiva el presente documento en el plan de autocontrol APPCC.
              </p>
            </div>
            <div className="sm:text-right font-mono text-[11px] text-neutral self-end">
              <p>FECHA EMISIÓN: {new Date(technicalAuditSheet.generatedAt).toLocaleDateString("es-ES")}</p>
              <p className="mt-4 pt-2 border-t border-primary/40 text-primary font-bold">
                FIRMA Y SELLO DEL OBRADOR
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
