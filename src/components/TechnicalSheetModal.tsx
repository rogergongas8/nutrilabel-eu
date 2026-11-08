"use client";

import React from "react";
import { X, Printer, ShieldCheck, CheckCircle2 } from "lucide-react";
import { CalculationResult } from "@/types/nutrition";

interface TechnicalSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculation: CalculationResult | null;
  productName?: string;
  lang?: "es" | "en";
}

export const TechnicalSheetModal: React.FC<TechnicalSheetModalProps> = ({
  isOpen,
  onClose,
  calculation,
  productName = "Food Product",
  lang = "en",
}) => {
  if (!isOpen || !calculation) return null;

  const isEn = lang === "en";

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl border border-neutral-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl text-neutral-900">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-neutral-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/80">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                {isEn
                  ? "Technical Traceability Dossier for Food Inspection (HACCP)"
                  : "Expediente Técnico de Trazabilidad para Inspección Sanitaria (APPCC)"}
              </h3>
              <p className="font-mono text-[11px] text-neutral-500 uppercase">
                DOC-REF: EU-1169/2011-ART31.4 ·{" "}
                {isEn
                  ? "VALID FOR OFFICIAL SANITARY AUDIT"
                  : "VÁLIDO ANTE AUTORIDAD SANITARIA"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="h-9 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isEn ? "Print A4 Dossier" : "Imprimir A4"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Dossier Body */}
        <div className="p-6 sm:p-8 space-y-6 text-sm" id="printable-technical-sheet">
          {/* Official Normative Box */}
          <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">
                {isEn
                  ? "LEGAL BASIS FOR THEORETICAL NUTRITION CALCULATION"
                  : "FUNDAMENTO JURÍDICO DEL CÁLCULO TEÓRICO"}
              </span>
              <h4 className="text-sm font-bold text-neutral-900 mt-0.5">
                {isEn
                  ? "Regulation (EU) No 1169/2011 — Article 31(4)(c)"
                  : "Reglamento (UE) Nº 1169/2011 — Artículo 31, Apartado 4, Letra c)"}
              </h4>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                {isEn
                  ? "«Declared values shall be average values based on calculation from generally established and accepted data (BEDCA / AECOSAN and USDA FoodData Central databases).»"
                  : "«Los valores declarados serán valores medios que se basarán en el cálculo efectuado a partir de datos generalmente establecidos y aceptados (Base de Datos Española de Composición de Alimentos BEDCA / AECOSAN y USDA FoodData Central).»"}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1.5 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isEn ? "LEGAL COMPLIANCE" : "CONFORME LEY"}</span>
            </span>
          </div>

          {/* Batch Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 font-mono text-xs">
            <div>
              <span className="text-neutral-400 block text-[10px]">
                {isEn ? "PRODUCT NAME:" : "DENOMINACIÓN:"}
              </span>
              <strong className="text-neutral-900 text-sm">{productName}</strong>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px]">
                {isEn ? "RAW BATCH WEIGHT:" : "MASA CRUDA LOTE:"}
              </span>
              <strong className="text-neutral-900 text-sm">{rawWeightGrams} g</strong>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px]">
                {isEn ? "COOKING WATER LOSS:" : "MERMA COCCIÓN:"}
              </span>
              <strong className="text-emerald-700 text-sm">
                -{(evaporationFactor * 100).toFixed(0)}%
              </strong>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px]">
                {isEn ? "FINISHED NET WEIGHT:" : "PESO TERMINADO:"}
              </span>
              <strong className="text-neutral-900 text-sm">
                {finishedWeightGrams.toFixed(0)} g
              </strong>
            </div>
          </div>

          {/* Ingredient Provenance Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
              {isEn
                ? "1. Weighted Formulation & Official Scientific Data Sources"
                : "1. Escandallo Ponderado y Procedencia Científica de Datos"}
            </h4>
            <div className="overflow-x-auto rounded-xl border border-neutral-200/80 bg-white">
              <table className="w-full text-left text-xs divide-y divide-neutral-200/60">
                <thead className="bg-neutral-50 text-[11px] font-semibold text-neutral-500 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">
                      {isEn ? "Raw Ingredient" : "Materia Prima"}
                    </th>
                    <th className="py-2.5 px-3">
                      {isEn ? "Official Database Code" : "Código Oficial Acreditado"}
                    </th>
                    <th className="py-2.5 px-3 text-right">
                      {isEn ? "Raw Weight" : "Peso Crudo"}
                    </th>
                    <th className="py-2.5 px-3 text-right">
                      {isEn ? "% Formula" : "% Fórmula"}
                    </th>
                    <th className="py-2.5 px-3">
                      {isEn ? "Annex II Allergens" : "Alérgenos Anexo II"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-800">
                  {technicalAuditSheet.itemsBreakdown.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 font-medium text-neutral-900">
                        {item.name}
                      </td>
                      <td className="py-2 px-3 font-mono text-neutral-500">
                        {item.source}
                      </td>
                      <td className="py-2 px-3 text-right font-medium text-neutral-900">
                        {item.amountGrams} g
                      </td>
                      <td className="py-2 px-3 text-right text-neutral-500">
                        {item.percentageOfRecipe}%
                      </td>
                      <td className="py-2 px-3">
                        {item.allergens.length > 0 ? (
                          <span className="font-semibold text-red-600">
                            {item.allergens.join(", ")}
                          </span>
                        ) : (
                          <span className="text-neutral-400">
                            {isEn ? "None" : "Exento"}
                          </span>
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
              {isEn
                ? "2. Resulting Average Nutrition Declaration (Per 100 g Finished Product)"
                : "2. Valores Nutricionales Medios Resultantes (Por 100 g de Producto Terminado)"}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-neutral-400 block text-[10px]">
                  {isEn ? "ENERGY:" : "VALOR ENERGÉTICO:"}
                </span>
                <strong className="text-neutral-900 font-bold">
                  {per100g.energyKj} kJ / {per100g.energyKcal} kcal
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-neutral-400 block text-[10px]">
                  {isEn ? "FAT (SATURATES):" : "GRASAS (SATURADAS):"}
                </span>
                <strong className="text-neutral-900 font-bold">
                  {per100g.fat} g ({per100g.saturatedFat} g)
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-neutral-400 block text-[10px]">
                  {isEn ? "CARBS (SUGARS):" : "HIDRATOS (AZÚCARES):"}
                </span>
                <strong className="text-neutral-900 font-bold">
                  {per100g.carbs} g ({per100g.sugars} g)
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <span className="text-neutral-400 block text-[10px]">
                  {isEn ? "PROTEIN / SALT:" : "PROTEÍNAS / SAL:"}
                </span>
                <strong className="text-neutral-900 font-bold">
                  {per100g.protein} g / {per100g.salt} g
                </strong>
              </div>
            </div>
          </div>

          {/* Signature Box for Sanitary Inspector */}
          <div className="pt-4 border-t border-neutral-200/80 flex flex-col sm:flex-row justify-between gap-6 text-xs text-neutral-500">
            <div className="max-w-md">
              <p className="font-semibold text-neutral-900 uppercase">
                {isEn
                  ? "Food Business Operator / HACCP Quality Sign-off:"
                  : "Conformidad del Responsable de Calidad / Operador:"}
              </p>
              <p className="mt-1 leading-relaxed">
                {isEn
                  ? "The operator certifies that the batch weights correspond to the actual formulation and archives this document in the HACCP self-control plan."
                  : "El operador certifica que las cantidades ponderadas corresponden fielmente al lote elaborado y se archiva el presente documento en el plan de autocontrol APPCC."}
              </p>
            </div>
            <div className="sm:text-right text-[11px] self-end">
              <p>
                {isEn ? "ISSUE DATE: " : "FECHA EMISIÓN: "}
                {new Date(technicalAuditSheet.generatedAt).toLocaleDateString(
                  isEn ? "en-US" : "es-ES"
                )}
              </p>
              <p className="mt-3 pt-2 border-t border-neutral-300 font-bold text-neutral-800">
                {isEn ? "SIGNATURE & STAMP" : "FIRMA Y SELLO DEL OBRADOR"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
