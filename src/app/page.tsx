"use client";

import React, { useState, useMemo } from "react";
import { FileText, Scale, Wine, PackageCheck, ShieldCheck } from "lucide-react";
import { RecipeBuilder } from "@/components/RecipeBuilder";
import { NutritionLabel } from "@/components/NutritionLabel";
import { WineELabelStudio } from "@/components/WineELabelStudio";
import { TechnicalSheetModal } from "@/components/TechnicalSheetModal";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RecipeItem, Ingredient } from "@/types/nutrition";
import { VERIFIED_INGREDIENTS } from "@/data/ingredients";
import { calculateRecipeNutrition } from "@/lib/calculator";

export default function NutriLabelToolFirstPage() {
  const [workMode, setWorkMode] = useState<"food" | "wine">("food");
  const [productName, setProductName] = useState(
    "Galletas Artesanas de Avena y Miel"
  );
  const [evaporationPercent, setEvaporationPercent] = useState<number>(12);
  const [servingsCount, setServingsCount] = useState<number>(12);
  const [isAuditSheetOpen, setIsAuditSheetOpen] = useState(false);

  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>(() => {
    const find = (id: string) => VERIFIED_INGREDIENTS.find((i) => i.id === id)!;
    return [
      { ingredientId: "copos-avena", ingredient: find("copos-avena"), amountGrams: 200 },
      { ingredientId: "harina-trigo-comun", ingredient: find("harina-trigo-comun"), amountGrams: 100 },
      { ingredientId: "mantequilla-sin-sal", ingredient: find("mantequilla-sin-sal"), amountGrams: 80 },
      { ingredientId: "miel-abeja", ingredient: find("miel-abeja"), amountGrams: 70 },
      { ingredientId: "huevo-entero-fresco", ingredient: find("huevo-entero-fresco"), amountGrams: 50 },
      { ingredientId: "nueces-peladas", ingredient: find("nueces-peladas"), amountGrams: 40 },
    ];
  });

  const calculation = useMemo(() => {
    if (recipeItems.length === 0) return null;
    try {
      return calculateRecipeNutrition(recipeItems, {
        evaporationPercent,
        servingsCount,
      });
    } catch {
      return null;
    }
  }, [recipeItems, evaporationPercent, servingsCount]);

  const handleAddItem = (ingredient: Ingredient, amountGrams: number) => {
    setRecipeItems((prev) => [
      ...prev,
      { ingredientId: ingredient.id, ingredient, amountGrams },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setRecipeItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateAmount = (index: number, newAmount: number) => {
    setRecipeItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, amountGrams: newAmount } : item
      )
    );
  };

  const handleLoadPreset = (
    preset: "galletas" | "mermelada" | "salsa" | "mealprep"
  ) => {
    const find = (id: string) => VERIFIED_INGREDIENTS.find((i) => i.id === id)!;
    if (preset === "galletas") {
      setProductName("Galletas Artesanas de Avena y Miel");
      setEvaporationPercent(12);
      setServingsCount(12);
      setRecipeItems([
        { ingredientId: "copos-avena", ingredient: find("copos-avena"), amountGrams: 200 },
        { ingredientId: "harina-trigo-comun", ingredient: find("harina-trigo-comun"), amountGrams: 100 },
        { ingredientId: "mantequilla-sin-sal", ingredient: find("mantequilla-sin-sal"), amountGrams: 80 },
        { ingredientId: "miel-abeja", ingredient: find("miel-abeja"), amountGrams: 70 },
        { ingredientId: "huevo-entero-fresco", ingredient: find("huevo-entero-fresco"), amountGrams: 50 },
        { ingredientId: "nueces-peladas", ingredient: find("nueces-peladas"), amountGrams: 40 },
      ]);
    } else if (preset === "mermelada") {
      setProductName("Mermelada Extra de Fresa de Temporada");
      setEvaporationPercent(22);
      setServingsCount(10);
      setRecipeItems([
        { ingredientId: "fresas-frescas", ingredient: find("fresas-frescas"), amountGrams: 600 },
        { ingredientId: "azucar-moreno", ingredient: find("azucar-moreno"), amountGrams: 280 },
        { ingredientId: "agua-potable", ingredient: find("agua-potable"), amountGrams: 40 },
      ]);
    } else if (preset === "salsa") {
      setProductName("Salsa Napolitana Artesana con AOVE");
      setEvaporationPercent(15);
      setServingsCount(6);
      setRecipeItems([
        { ingredientId: "tomate-triturado", ingredient: find("tomate-triturado"), amountGrams: 700 },
        { ingredientId: "cebolla-fresca", ingredient: find("cebolla-fresca"), amountGrams: 120 },
        { ingredientId: "aceite-oliva-virgen-extra", ingredient: find("aceite-oliva-virgen-extra"), amountGrams: 45 },
        { ingredientId: "azucar-blanco", ingredient: find("azucar-blanco"), amountGrams: 10 },
        { ingredientId: "sal-comun", ingredient: find("sal-comun"), amountGrams: 8 },
      ]);
    } else if (preset === "mealprep") {
      setProductName("Tupper Fitness: Pollo con Garbanzos y AOVE");
      setEvaporationPercent(8);
      setServingsCount(1);
      setRecipeItems([
        { ingredientId: "pechuga-pollo-cruda", ingredient: find("pechuga-pollo-cruda"), amountGrams: 180 },
        { ingredientId: "garbanzos-cocidos-conserva", ingredient: find("garbanzos-cocidos-conserva"), amountGrams: 150 },
        { ingredientId: "tomate-triturado", ingredient: find("tomate-triturado"), amountGrams: 80 },
        { ingredientId: "aceite-oliva-virgen-extra", ingredient: find("aceite-oliva-virgen-extra"), amountGrams: 15 },
        { ingredientId: "sal-comun", ingredient: find("sal-comun"), amountGrams: 2 },
      ]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      {/* Compact Tool-First Top Bar */}
      <header className="sticky top-0 z-40 bg-[#F6F3EC]/95 backdrop-blur border-b-2 border-primary py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary text-[#F6F3EC] flex items-center justify-center border border-primary">
              <Scale className="w-4 h-4 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-extrabold text-primary">
                  NutriLabel
                </span>
                <Badge variant="mono">ART. 31.4 UE 1169/2011</Badge>
              </div>
              <p className="font-mono text-[10px] text-neutral uppercase">
                Estación de Cálculo Nutricional · Fuentes Oficiales BEDCA / USDA
              </p>
            </div>
          </div>

          {/* 2-Mode Workstation Switcher */}
          <div className="flex border-2 border-primary bg-[#EAE5D9] p-0.5 font-mono text-xs font-bold">
            <button
              type="button"
              onClick={() => setWorkMode("food")}
              className={`px-3.5 py-1.5 flex items-center gap-1.5 transition-colors cursor-pointer ${
                workMode === "food"
                  ? "bg-primary text-[#F6F3EC]"
                  : "text-primary hover:bg-primary/10"
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>1. Alimento Envasado (UE 1169)</span>
            </button>
            <button
              type="button"
              onClick={() => setWorkMode("wine")}
              className={`px-3.5 py-1.5 flex items-center gap-1.5 transition-colors cursor-pointer ${
                workMode === "wine"
                  ? "bg-primary text-[#F6F3EC]"
                  : "text-primary hover:bg-primary/10"
              }`}
            >
              <Wine className="w-3.5 h-3.5" />
              <span>2. Vino / Bebida QR (UE 2021/2117)</span>
            </button>
          </div>

          {/* Direct Audit Dossier Action */}
          {workMode === "food" && recipeItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAuditSheetOpen(true)}
            >
              <FileText className="w-3.5 h-3.5 text-accent" />
              <span>Expediente Sanidad (APPCC)</span>
            </Button>
          )}
        </div>
      </header>

      {/* Direct Tool-First Workspace (Zero Marketing Fluff) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {workMode === "food" ? (
          <>
            {/* Compact Product Title & Telemetry Bar */}
            <div className="bg-surface border-2 border-primary p-4 mb-6 shadow-tactile-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <label
                  htmlFor="product-title-input"
                  className="block font-mono text-[10px] font-bold uppercase tracking-widest text-accent mb-0.5"
                >
                  Denominación del Alimento Envasado (Art. 17 Reglamento UE 1169/2011):
                </label>
                <input
                  id="product-title-input"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full font-display text-lg sm:text-xl font-bold text-primary bg-transparent border-b border-primary/30 focus:border-accent focus:outline-none pb-0.5"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs shrink-0">
                <div className="px-3 py-1.5 bg-white border border-primary/30">
                  <span className="text-neutral block text-[9px]">PESO TERMINADO</span>
                  <strong className="text-primary">
                    {calculation ? `${calculation.finishedWeightGrams.toFixed(0)} g` : "0 g"}
                  </strong>
                </div>
                <div className="px-3 py-1.5 bg-white border border-primary/30">
                  <span className="text-neutral block text-[9px]">ENERGÍA / 100G</span>
                  <strong className="text-primary">
                    {calculation ? `${calculation.per100g.energyKcal} kcal` : "0 kcal"}
                  </strong>
                </div>
                <div className="px-3 py-1.5 bg-primary text-[#F6F3EC]">
                  <span className="text-[#F6F3EC]/70 block text-[9px]">ALÉRGENOS UE</span>
                  <strong className="text-accent">
                    {calculation ? `${calculation.allergens.length} detectados` : "0"}
                  </strong>
                </div>
              </div>
            </div>

            {/* 12-Col Workstation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <RecipeBuilder
                  recipeItems={recipeItems}
                  onAddItem={handleAddItem}
                  onRemoveItem={handleRemoveItem}
                  onUpdateAmount={handleUpdateAmount}
                  evaporationPercent={evaporationPercent}
                  onUpdateEvaporation={setEvaporationPercent}
                  servingsCount={servingsCount}
                  onUpdateServings={setServingsCount}
                  onLoadPreset={handleLoadPreset}
                />
              </div>

              <div className="lg:col-span-5 lg:sticky lg:top-20">
                <NutritionLabel
                  calculation={calculation}
                  onOpenAuditSheet={() => setIsAuditSheetOpen(true)}
                  productName={productName}
                />
              </div>
            </div>
          </>
        ) : (
          <WineELabelStudio />
        )}
      </main>

      {/* Legal Disclaimer & Official Normative Footer */}
      <Footer />

      {/* Printable Sanitary Inspection Dossier Modal (APPCC) */}
      <TechnicalSheetModal
        isOpen={isAuditSheetOpen}
        onClose={() => setIsAuditSheetOpen(false)}
        calculation={calculation}
        productName={productName}
      />
    </div>
  );
}
