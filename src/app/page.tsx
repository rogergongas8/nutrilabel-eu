"use client";

import React, { useState, useMemo, useRef } from "react";
import { FileText, Plus } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { RecipeBuilder } from "@/components/RecipeBuilder";
import { NutritionLabel } from "@/components/NutritionLabel";
import { WineELabelStudio } from "@/components/WineELabelStudio";
import { TechnicalSheetModal } from "@/components/TechnicalSheetModal";
import { Footer } from "@/components/Footer";
import { RecipeItem, Ingredient } from "@/types/nutrition";
import { VERIFIED_INGREDIENTS } from "@/data/ingredients";
import { calculateRecipeNutrition } from "@/lib/calculator";
import { SeoFoodTemplate } from "@/data/seo-templates";

interface NutriLabelPageProps {
  initialTemplate?: SeoFoodTemplate;
}

export function NutriLabelWorkspace({ initialTemplate }: NutriLabelPageProps) {
  const [lang, setLang] = useState<"es" | "en">("en");
  const [workMode, setWorkMode] = useState<"food" | "wine">(
    initialTemplate?.workMode || "food"
  );
  const [productName, setProductName] = useState(
    initialTemplate?.productNameEn || "Oat & Honey Cookies"
  );
  const [evaporationPercent, setEvaporationPercent] = useState<number>(
    initialTemplate ? initialTemplate.evaporationPercent : 12
  );
  const [servingsCount, setServingsCount] = useState<number>(
    initialTemplate ? initialTemplate.servingsCount : 10
  );
  const [isAuditSheetOpen, setIsAuditSheetOpen] = useState(false);

  const productInputRef = useRef<HTMLInputElement>(null);
  const isEn = lang === "en";

  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>(() => {
    const find = (id: string) => VERIFIED_INGREDIENTS.find((i) => i.id === id)!;
    if (initialTemplate && initialTemplate.recipeItems.length > 0) {
      return initialTemplate.recipeItems
        .map((r) => {
          const ing = find(r.ingredientId);
          return ing
            ? {
                ingredientId: r.ingredientId,
                ingredient: ing,
                amountGrams: r.amountGrams,
              }
            : null;
        })
        .filter((x): x is RecipeItem => x !== null);
    }
    return [
      { ingredientId: "copos-avena", ingredient: find("copos-avena"), amountGrams: 200 },
      { ingredientId: "mantequilla-sin-sal", ingredient: find("mantequilla-sin-sal"), amountGrams: 80 },
      { ingredientId: "miel-abeja", ingredient: find("miel-abeja"), amountGrams: 60 },
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

  const handleStartNewBlankLabel = () => {
    setProductName("");
    setRecipeItems([]);
    setEvaporationPercent(0);
    setServingsCount(1);
    setTimeout(() => {
      productInputRef.current?.focus();
    }, 50);
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-neutral-900">
      {/* Minimalist Top Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 h-14 px-4 sm:px-6 flex items-center">
        <div className="max-w-5xl w-full mx-auto flex items-center justify-between gap-4">
          <a href="/" className="hover:opacity-80 transition-opacity">
            <BrandLogo />
          </a>

          <div className="flex items-center gap-2.5">
            {/* Mode Switcher */}
            <div className="flex rounded-lg bg-neutral-100 p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setWorkMode("food")}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  workMode === "food"
                    ? "bg-white text-neutral-900 shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {isEn ? "Food Label" : "Alimentos"}
              </button>
              <button
                type="button"
                onClick={() => setWorkMode("wine")}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  workMode === "wine"
                    ? "bg-white text-neutral-900 shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {isEn ? "Wine QR" : "Vinos QR"}
              </button>
            </div>

            {/* Language Switcher EN | ES */}
            <div className="flex rounded-lg bg-neutral-100 p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-1.5 rounded-md transition-all cursor-pointer ${
                  lang === "en"
                    ? "bg-white text-neutral-900 shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("es")}
                className={`px-2 py-1.5 rounded-md transition-all cursor-pointer ${
                  lang === "es"
                    ? "bg-white text-neutral-900 shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                ES
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {workMode === "food" ? (
          <>
            {/* Minimal Title Row */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
                  {initialTemplate
                    ? isEn
                      ? initialTemplate.h1En
                      : initialTemplate.h1Es
                    : isEn
                    ? "Nutrition Label Generator"
                    : "Generador de Etiquetas Nutricionales"}
                </h1>
                <p className="text-sm text-neutral-500 mt-0.5">
                  {isEn
                    ? "Add your recipe ingredients in grams to generate your print-ready FDA or EU/UK label."
                    : "Añade los ingredientes en gramos para generar tu etiqueta oficial lista para imprimir."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleStartNewBlankLabel}
                className="px-3.5 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isEn ? "New Blank" : "En blanco"}</span>
              </button>
            </div>

            {/* Clean 2-Column Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 7 Columns */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white rounded-xl border border-neutral-200/90 p-5">
                  <label
                    htmlFor="product-title-input"
                    className="block text-xs font-medium text-neutral-500 mb-1.5"
                  >
                    {isEn ? "Product Name" : "Nombre del producto"}
                  </label>
                  <input
                    ref={productInputRef}
                    id="product-title-input"
                    type="text"
                    placeholder={
                      isEn ? "e.g. Homemade Granola..." : "Ej. Granola Casera..."
                    }
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-lg bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-neutral-900 focus:outline-none text-sm font-medium text-neutral-900 transition-colors"
                  />
                </div>

                <RecipeBuilder
                  recipeItems={recipeItems}
                  onAddItem={handleAddItem}
                  onRemoveItem={handleRemoveItem}
                  onUpdateAmount={handleUpdateAmount}
                  evaporationPercent={evaporationPercent}
                  onUpdateEvaporation={setEvaporationPercent}
                  servingsCount={servingsCount}
                  onUpdateServings={setServingsCount}
                  onStartBlank={handleStartNewBlankLabel}
                  lang={lang}
                />
              </div>

              {/* Right 5 Columns */}
              <div className="lg:col-span-5 lg:sticky lg:top-20">
                <NutritionLabel
                  calculation={calculation}
                  onOpenAuditSheet={() => setIsAuditSheetOpen(true)}
                  productName={
                    productName || (isEn ? "Food Product" : "Producto")
                  }
                  lang={lang}
                />

                {recipeItems.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsAuditSheetOpen(true)}
                    className="mt-3 w-full py-2 text-xs text-neutral-400 hover:text-neutral-800 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>
                      {isEn
                        ? "View technical audit sheet"
                        : "Ver ficha técnica para Sanidad"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <WineELabelStudio lang={lang} />
        )}
      </main>

      <Footer lang={lang} />

      <TechnicalSheetModal
        isOpen={isAuditSheetOpen}
        onClose={() => setIsAuditSheetOpen(false)}
        calculation={calculation}
        productName={productName || (isEn ? "Food Product" : "Producto")}
        lang={lang}
      />
    </div>
  );
}

export default function NutriLabelToolFirstPage() {
  return <NutriLabelWorkspace />;
}
