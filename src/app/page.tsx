"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  FileText,
  Scale,
  Wine,
  PackageCheck,
  Plus,
  Sparkles,
} from "lucide-react";
import { RecipeBuilder } from "@/components/RecipeBuilder";
import { NutritionLabel } from "@/components/NutritionLabel";
import { WineELabelStudio } from "@/components/WineELabelStudio";
import { TechnicalSheetModal } from "@/components/TechnicalSheetModal";
import { Footer } from "@/components/Footer";
import { RecipeItem, Ingredient } from "@/types/nutrition";
import { VERIFIED_INGREDIENTS } from "@/data/ingredients";
import { calculateRecipeNutrition } from "@/lib/calculator";

export default function NutriLabelToolFirstPage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [workMode, setWorkMode] = useState<"food" | "wine">("food");
  const [productName, setProductName] = useState(
    "Galletas Artesanas de Avena y Miel"
  );
  const [evaporationPercent, setEvaporationPercent] = useState<number>(12);
  const [servingsCount, setServingsCount] = useState<number>(12);
  const [isAuditSheetOpen, setIsAuditSheetOpen] = useState(false);

  const productInputRef = useRef<HTMLInputElement>(null);
  const labelPreviewRef = useRef<HTMLDivElement>(null);
  const isEn = lang === "en";

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

  const handleLoadPreset = (
    preset: "galletas" | "mermelada" | "salsa" | "mealprep"
  ) => {
    const find = (id: string) => VERIFIED_INGREDIENTS.find((i) => i.id === id)!;
    if (preset === "galletas") {
      setProductName(
        isEn
          ? "Artisanal Oat & Honey Cookies"
          : "Galletas Artesanas de Avena y Miel"
      );
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
      setProductName(
        isEn ? "Extra Strawberry Artisan Jam" : "Mermelada Extra de Fresa"
      );
      setEvaporationPercent(22);
      setServingsCount(10);
      setRecipeItems([
        { ingredientId: "fresas-frescas", ingredient: find("fresas-frescas"), amountGrams: 600 },
        { ingredientId: "azucar-moreno", ingredient: find("azucar-moreno"), amountGrams: 280 },
        { ingredientId: "agua-potable", ingredient: find("agua-potable"), amountGrams: 40 },
      ]);
    } else if (preset === "salsa") {
      setProductName(
        isEn ? "Neapolitan Tomato Sauce" : "Salsa Napolitana con AOVE"
      );
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
      setProductName(
        isEn
          ? "High-Protein Chicken & Chickpea Bowl"
          : "Tupper Pollo con Garbanzos"
      );
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
    <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-stone-800">
      {/* Soft, Airy Top Bar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-stone-200/80 py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-900 text-white flex items-center justify-center shadow-sm">
              <Scale className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-stone-900">
                NutriLabel
              </span>
              <span className="hidden sm:inline-block ml-2.5 text-xs text-stone-500 font-medium">
                {isEn
                  ? "Official EU & FDA Nutrition Label Generator"
                  : "Generador de Etiquetas Nutricionales Oficiales"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Soft Pill Switcher */}
            <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setWorkMode("food")}
                className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  workMode === "food"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isEn ? "Food Label" : "Alimentos"}</span>
              </button>
              <button
                type="button"
                onClick={() => setWorkMode("wine")}
                className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  workMode === "wine"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <Wine className="w-3.5 h-3.5 text-amber-700" />
                <span>{isEn ? "Wine QR" : "Vinos QR"}</span>
              </button>
            </div>

            {/* Language Switcher ES | EN */}
            <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLang("es")}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  lang === "es"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  lang === "en"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8">
        {workMode === "food" ? (
          <>
            {/* Calm, Breathable Intro Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                  {isEn
                    ? "Create your nutrition label in 3 simple steps"
                    : "Crea tu etiqueta nutricional de forma sencilla"}
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                  {isEn
                    ? "1. Name your product · 2. Add your ingredients in grams · 3. Download your print-ready PNG or SVG."
                    : "1. Escribe el nombre · 2. Añade los ingredientes y sus gramos · 3. Descarga tu etiqueta lista para imprimir."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleStartNewBlankLabel}
                  className="px-4 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {isEn
                      ? "New Blank Label"
                      : "Empezar Etiqueta en Blanco"}
                  </span>
                </button>
              </div>
            </div>

            {/* Clean 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 7 Columns: Single Cohesive Recipe Card */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6">
                  {/* Product Name Input + Quick Examples */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <label
                      htmlFor="product-title-input"
                      className="text-xs font-semibold text-stone-500"
                    >
                      {isEn ? "1. Product Name" : "1. Nombre de tu producto"}
                    </label>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-stone-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        {isEn ? "Examples:" : "Ejemplos:"}
                      </span>
                      {(
                        [
                          { id: "galletas", label: isEn ? "Cookies" : "Galletas" },
                          { id: "mermelada", label: isEn ? "Jam" : "Mermelada" },
                          { id: "salsa", label: isEn ? "Sauce" : "Salsa" },
                          { id: "mealprep", label: isEn ? "Bowl" : "Tupper" },
                        ] as const
                      ).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleLoadPreset(p.id)}
                          className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 font-medium transition-colors cursor-pointer"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    ref={productInputRef}
                    id="product-title-input"
                    type="text"
                    placeholder={
                      isEn
                        ? "e.g. Homemade Yogurt Cake, Artisan Tomato Sauce..."
                        : "Ej. Bizcocho Casero de Yogur, Salsa de Tomate..."
                    }
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-stone-50/70 border border-stone-200 focus:bg-white focus:border-emerald-700 focus:outline-none text-base font-semibold text-stone-900 transition-all"
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

              {/* Right 5 Columns: Sticky Label Preview */}
              <div
                ref={labelPreviewRef}
                className="lg:col-span-5 lg:sticky lg:top-24"
              >
                <div className="mb-2.5 flex items-center justify-between px-1">
                  <span className="text-xs font-semibold text-stone-500">
                    {isEn
                      ? "3. Live Nutrition Label Preview"
                      : "3. Vista previa de tu etiqueta en vivo"}
                  </span>
                  {recipeItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsAuditSheetOpen(true)}
                      className="text-xs font-semibold text-emerald-800 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>
                        {isEn ? "Sanitary Report" : "Informe para Sanidad"}
                      </span>
                    </button>
                  )}
                </div>

                <NutritionLabel
                  calculation={calculation}
                  onOpenAuditSheet={() => setIsAuditSheetOpen(true)}
                  productName={
                    productName || (isEn ? "My Food Product" : "Mi Producto")
                  }
                  lang={lang}
                />
              </div>
            </div>
          </>
        ) : (
          <WineELabelStudio />
        )}
      </main>

      <Footer />

      <TechnicalSheetModal
        isOpen={isAuditSheetOpen}
        onClose={() => setIsAuditSheetOpen(false)}
        calculation={calculation}
        productName={productName || (isEn ? "My Food Product" : "Mi Producto")}
      />
    </div>
  );
}
