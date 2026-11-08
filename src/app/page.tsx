"use client";

import React, { useState, useMemo, useRef } from "react";
import { FileText, Wine, PackageCheck, Plus } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { RecipeBuilder } from "@/components/RecipeBuilder";
import { NutritionLabel } from "@/components/NutritionLabel";
import { WineELabelStudio } from "@/components/WineELabelStudio";
import { TechnicalSheetModal } from "@/components/TechnicalSheetModal";
import { Footer } from "@/components/Footer";
import { RecipeItem, Ingredient } from "@/types/nutrition";
import { VERIFIED_INGREDIENTS } from "@/data/ingredients";
import { calculateRecipeNutrition } from "@/lib/calculator";

export default function NutriLabelToolFirstPage() {
  const [lang, setLang] = useState<"es" | "en">("en");
  const [workMode, setWorkMode] = useState<"food" | "wine">("food");
  const [productName, setProductName] = useState(
    "Artisanal Oat & Honey Cookies"
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
    <div className="min-h-screen flex flex-col bg-[#F4EFE6] text-[#231F1D]">
      {/* Warm Apothecary Header */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E2D9C8] py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <BrandLogo
            subtitle={
              isEn
                ? "Official EU 1169/2011 & FDA Nutrition Label Maker"
                : "Estudio de Etiquetado Nutricional · Reglamento UE 1169/2011"
            }
          />

          <div className="flex items-center gap-3">
            {/* Warm Linen Pill Switcher */}
            <div className="flex rounded-xl bg-[#EBE4D8] p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setWorkMode("food")}
                className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  workMode === "food"
                    ? "bg-[#FAF7F2] text-[#231F1D] shadow-xs"
                    : "text-[#6E655F] hover:text-[#231F1D]"
                }`}
              >
                <PackageCheck className="w-3.5 h-3.5 text-[#C84B31]" />
                <span>{isEn ? "Food Label" : "Alimentos"}</span>
              </button>
              <button
                type="button"
                onClick={() => setWorkMode("wine")}
                className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  workMode === "wine"
                    ? "bg-[#FAF7F2] text-[#231F1D] shadow-xs"
                    : "text-[#6E655F] hover:text-[#231F1D]"
                }`}
              >
                <Wine className="w-3.5 h-3.5 text-[#6B2D38]" />
                <span>{isEn ? "Wine QR" : "Bodegas / Vinos"}</span>
              </button>
            </div>

            {/* Language Switcher EN | ES */}
            <div className="flex rounded-xl bg-[#EBE4D8] p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setLang("en");
                  if (productName === "Galletas Artesanas de Avena y Miel") {
                    setProductName("Artisanal Oat & Honey Cookies");
                  }
                }}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  lang === "en"
                    ? "bg-[#FAF7F2] text-[#231F1D] shadow-xs"
                    : "text-[#6E655F] hover:text-[#231F1D]"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => {
                  setLang("es");
                  if (productName === "Artisanal Oat & Honey Cookies") {
                    setProductName("Galletas Artesanas de Avena y Miel");
                  }
                }}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  lang === "es"
                    ? "bg-[#FAF7F2] text-[#231F1D] shadow-xs"
                    : "text-[#6E655F] hover:text-[#231F1D]"
                }`}
              >
                ES
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8">
        {workMode === "food" ? (
          <>
            {/* Editorial Gastronomy Intro */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#231F1D] tracking-tight">
                  {isEn
                    ? "Craft your official nutrition label"
                    : "Elabora tu etiqueta nutricional oficial"}
                </h1>
                <p className="text-sm text-[#6E655F] mt-1">
                  {isEn
                    ? "1. Name your recipe · 2. Weigh your ingredients in grams · 3. Export your print-ready label."
                    : "1. Nombra tu receta · 2. Añade los ingredientes en gramos · 3. Descarga tu etiqueta lista para imprenta."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleStartNewBlankLabel}
                  className="px-4 py-2.5 rounded-xl bg-[#C84B31] hover:bg-[#AD3B23] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {isEn ? "New Blank Recipe" : "Empezar Receta en Blanco"}
                  </span>
                </button>
              </div>
            </div>

            {/* Clean 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 7 Columns: Single Cohesive Recipe Card */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] shadow-xs p-6">
                  {/* Product Name Input + Quick Examples */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <label
                      htmlFor="product-title-input"
                      className="text-xs font-semibold text-[#5C534C]"
                    >
                      {isEn ? "1. Product Name" : "1. Nombre del producto"}
                    </label>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[#8C827A]">
                        {isEn ? "Try recipe:" : "Probar receta:"}
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
                          className="px-2.5 py-0.5 rounded-md bg-[#EBE4D8] hover:bg-[#DFD6C7] text-[#3D3733] font-medium transition-colors cursor-pointer"
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
                    className="w-full h-11 px-4 rounded-xl bg-white border border-[#DCD2C0] focus:border-[#C84B31] focus:outline-none text-base font-semibold text-[#231F1D] transition-all"
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
                  <span className="text-xs font-semibold text-[#5C534C]">
                    {isEn
                      ? "3. Live Nutrition Label Preview"
                      : "3. Vista previa de la etiqueta"}
                  </span>
                  {recipeItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsAuditSheetOpen(true)}
                      className="text-xs font-semibold text-[#4A5D4E] hover:text-[#231F1D] flex items-center gap-1 cursor-pointer underline underline-offset-2"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>
                        {isEn ? "Sanitary Report" : "Ficha para Sanidad"}
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
          <WineELabelStudio lang={lang} />
        )}
      </main>

      <Footer lang={lang} />

      <TechnicalSheetModal
        isOpen={isAuditSheetOpen}
        onClose={() => setIsAuditSheetOpen(false)}
        calculation={calculation}
        productName={productName || (isEn ? "My Food Product" : "Mi Producto")}
        lang={lang}
      />
    </div>
  );
}
