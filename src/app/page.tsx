"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  FileText,
  Scale,
  Wine,
  PackageCheck,
  PlusCircle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { RecipeBuilder } from "@/components/RecipeBuilder";
import { NutritionLabel } from "@/components/NutritionLabel";
import { WineELabelStudio } from "@/components/WineELabelStudio";
import { TechnicalSheetModal } from "@/components/TechnicalSheetModal";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { RecipeItem, Ingredient } from "@/types/nutrition";
import { VERIFIED_INGREDIENTS } from "@/data/ingredients";
import { calculateRecipeNutrition } from "@/lib/calculator";

export default function NutriLabelToolFirstPage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [workMode, setWorkMode] = useState<"food" | "wine">("food");
  const [productName, setProductName] = useState(
    "Galletas Artesanas de Avena y Miel (Ejemplo)"
  );
  const [isExampleMode, setIsExampleMode] = useState(true);
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

  // Start a completely blank label from scratch
  const handleStartNewBlankLabel = () => {
    setIsExampleMode(false);
    setProductName("");
    setRecipeItems([]);
    setEvaporationPercent(0);
    setServingsCount(1);
    setTimeout(() => {
      productInputRef.current?.focus();
    }, 50);
  };

  const handleAddItem = (ingredient: Ingredient, amountGrams: number) => {
    setIsExampleMode(false);
    setRecipeItems((prev) => [
      ...prev,
      { ingredientId: ingredient.id, ingredient, amountGrams },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setIsExampleMode(false);
    setRecipeItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateAmount = (index: number, newAmount: number) => {
    setIsExampleMode(false);
    setRecipeItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, amountGrams: newAmount } : item
      )
    );
  };

  const handleLoadPreset = (
    preset: "galletas" | "mermelada" | "salsa" | "mealprep"
  ) => {
    setIsExampleMode(true);
    const find = (id: string) => VERIFIED_INGREDIENTS.find((i) => i.id === id)!;
    if (preset === "galletas") {
      setProductName(
        isEn
          ? "Artisanal Oat & Honey Cookies (Sample)"
          : "Galletas Artesanas de Avena y Miel (Ejemplo)"
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
        isEn
          ? "Extra Strawberry Artisan Jam (Sample)"
          : "Mermelada Extra de Fresa (Ejemplo)"
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
        isEn
          ? "Neapolitan Tomato Sauce with EVOO (Sample)"
          : "Salsa Napolitana con AOVE (Ejemplo)"
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
          ? "High-Protein Chicken & Chickpea Bowl (Sample)"
          : "Tupper Fitness: Pollo con Garbanzos (Ejemplo)"
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

  const scrollToLabel = () => {
    labelPreviewRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      {/* Top Navigation Bar */}
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
                <Badge variant="mono">EU / UK 1169/2011 &amp; FDA</Badge>
              </div>
              <p className="font-mono text-[10px] text-neutral uppercase">
                {isEn
                  ? "Official Nutrition Label & Wine E-Label Generator · BEDCA / USDA"
                  : "Generador Oficial de Etiquetas Nutricionales · BEDCA / USDA"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* 2-Mode Switcher */}
            <div className="flex border-2 border-primary bg-[#EAE5D9] p-0.5 font-mono text-xs font-bold">
              <button
                type="button"
                onClick={() => setWorkMode("food")}
                className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  workMode === "food"
                    ? "bg-primary text-[#F6F3EC]"
                    : "text-primary hover:bg-primary/10"
                }`}
              >
                <PackageCheck className="w-3.5 h-3.5" />
                <span>{isEn ? "Food Labels" : "Etiqueta de Alimentos"}</span>
              </button>
              <button
                type="button"
                onClick={() => setWorkMode("wine")}
                className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  workMode === "wine"
                    ? "bg-primary text-[#F6F3EC]"
                    : "text-primary hover:bg-primary/10"
                }`}
              >
                <Wine className="w-3.5 h-3.5" />
                <span>{isEn ? "Wine QR E-Label" : "Etiqueta QR de Vinos"}</span>
              </button>
            </div>

            {/* Global Language Switcher ES | EN */}
            <div className="flex border-2 border-primary bg-[#EAE5D9] p-0.5 font-mono text-xs font-bold">
              <button
                type="button"
                onClick={() => setLang("es")}
                className={`px-2.5 py-1.5 transition-colors cursor-pointer ${
                  lang === "es"
                    ? "bg-accent text-white"
                    : "text-primary hover:bg-primary/10"
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1.5 transition-colors cursor-pointer ${
                  lang === "en"
                    ? "bg-accent text-white"
                    : "text-primary hover:bg-primary/10"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {workMode === "food" ? (
          <>
            {/* HERO EXPLANATION + "CREAR ETIQUETA DESDE CERO" CTA */}
            <div className="bg-primary text-[#F6F3EC] border-2 border-primary p-5 sm:p-6 mb-6 shadow-tactile">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <span className="inline-block font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 bg-accent text-white font-bold">
                    {isEn
                      ? "HOW IT WORKS · 3 SIMPLE STEPS"
                      : "¿CÓMO FUNCIONA? · EN 3 PASOS SIMPLES"}
                  </span>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight">
                    {isEn
                      ? "Create your official print-ready Nutrition Label in seconds"
                      : "Crea tu Etiqueta Nutricional Oficial lista para imprimir"}
                  </h1>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-[#F6F3EC]/90 font-sans">
                    <div className="flex items-start gap-2 bg-white/10 p-2.5 border border-white/15">
                      <span className="font-mono font-black text-accent">1.</span>
                      <span>
                        {isEn ? (
                          <>
                            <strong>Enter your product name</strong> or click{" "}
                            <em>&ldquo;Start New Blank Label&rdquo;</em>.
                          </>
                        ) : (
                          <>
                            <strong>Pon el nombre</strong> de tu producto o pulsa{" "}
                            <em>&ldquo;Empezar Etiqueta desde Cero&rdquo;</em>.
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 bg-white/10 p-2.5 border border-white/15">
                      <span className="font-mono font-black text-accent">2.</span>
                      <span>
                        {isEn ? (
                          <>
                            <strong>Add your ingredients</strong> and their weight in grams.
                          </>
                        ) : (
                          <>
                            <strong>Añade tus ingredientes</strong> y los gramos que usas en tu receta.
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 bg-white/10 p-2.5 border border-white/15">
                      <span className="font-mono font-black text-accent">3.</span>
                      <span>
                        {isEn ? (
                          <>
                            <strong>Download your label</strong> (300 DPI PNG or vector SVG) for free.
                          </>
                        ) : (
                          <>
                            <strong>Descarga la etiqueta</strong> (PNG o SVG) lista para pegar en tu envase.
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button: Clear Example & Start Fresh */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleStartNewBlankLabel}
                    className="h-12 px-5 bg-accent hover:bg-[#b83d1b] text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-white shadow-lg transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>
                      {isEn
                        ? "Create My Own Label (Start Blank)"
                        : "Crear Mi Propia Etiqueta (Desde Cero)"}
                    </span>
                  </button>

                  {isExampleMode ? (
                    <span className="font-mono text-[11px] text-[#F6F3EC]/80 text-center">
                      {isEn
                        ? "👆 Viewing a sample recipe. Click above to start blank."
                        : "👆 Ahora estás viendo una receta de ejemplo. Pulsa arriba para vaciarla."}
                    </span>
                  ) : (
                    <span className="font-mono text-[11px] text-emerald-300 text-center flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isEn
                        ? "Creation mode active: add your ingredients below"
                        : "Modo creación activo: rellena tus ingredientes abajo"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* PASO 1: Nombre del Producto */}
            <div className="bg-surface border-2 border-primary p-5 mb-6 shadow-tactile-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 bg-primary text-[#F6F3EC] font-mono text-[10px] font-bold uppercase">
                      {isEn ? "STEP 1 OF 3" : "PASO 1 DE 3"}
                    </span>
                    <label
                      htmlFor="product-title-input"
                      className="font-mono text-xs font-bold uppercase text-primary"
                    >
                      {isEn
                        ? "What is your product's name?"
                        : "¿Cómo se llama tu producto?"}
                    </label>
                  </div>
                  <input
                    ref={productInputRef}
                    id="product-title-input"
                    type="text"
                    placeholder={
                      isEn
                        ? "Type your product name here (e.g. Homemade Yogurt Cake, Artisan Hot Sauce...)"
                        : "Escribe aquí el nombre de tu producto (ej. Bizcocho Casero de Yogur, Salsa Brava...)"
                    }
                    value={productName}
                    onChange={(e) => {
                      setIsExampleMode(false);
                      setProductName(e.target.value);
                    }}
                    className="w-full h-11 px-3.5 font-display text-lg font-bold text-primary bg-white border-2 border-primary focus:border-accent focus:outline-none"
                  />
                </div>

                {/* Preset Selector */}
                <div className="shrink-0">
                  <span className="font-mono text-[10px] font-bold uppercase text-neutral block mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-accent" />
                    {isEn
                      ? "Or test with a sample recipe:"
                      : "¿O prefieres cargar una plantilla rápida?"}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        {
                          id: "galletas",
                          label: isEn ? "🍪 Cookies" : "🍪 Galletas",
                        },
                        {
                          id: "mermelada",
                          label: isEn ? "🍓 Jam" : "🍓 Mermelada",
                        },
                        {
                          id: "salsa",
                          label: isEn ? "🍅 Sauce" : "🍅 Salsa",
                        },
                        {
                          id: "mealprep",
                          label: isEn ? "🍗 Meal Prep" : "🍗 Tupper Pollo",
                        },
                      ] as const
                    ).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleLoadPreset(p.id)}
                        className="px-2.5 py-1.5 text-xs font-mono font-semibold border border-primary/40 bg-white hover:bg-primary hover:text-[#F6F3EC] transition-colors cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 12-Col Workstation: PASO 2 (Izquierda) + PASO 3 (Derecha) */}
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
                  onStartBlank={handleStartNewBlankLabel}
                  onScrollToLabel={scrollToLabel}
                  lang={lang}
                />
              </div>

              <div
                ref={labelPreviewRef}
                className="lg:col-span-5 lg:sticky lg:top-20"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-accent text-white font-mono text-xs font-bold uppercase">
                    {isEn
                      ? "STEP 3 OF 3 · LIVE GENERATED LABEL"
                      : "PASO 3 DE 3 · TU ETIQUETA GENERADA EN VIVO"}
                  </span>
                  {recipeItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsAuditSheetOpen(true)}
                      className="font-mono text-xs font-bold text-primary underline hover:text-accent flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-accent" />
                      <span>{isEn ? "HACCP Report" : "Informe Sanidad"}</span>
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
