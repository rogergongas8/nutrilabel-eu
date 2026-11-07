"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  Database,
  Sparkles,
  Scale,
  PlusCircle,
  X,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { Ingredient, RecipeItem, AllergenKey, MANDATORY_EU_ALLERGENS } from "@/types/nutrition";
import { VERIFIED_INGREDIENTS } from "@/data/ingredients";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface RecipeBuilderProps {
  recipeItems: RecipeItem[];
  onAddItem: (ingredient: Ingredient, amountGrams: number) => void;
  onRemoveItem: (index: number) => void;
  onUpdateAmount: (index: number, newAmount: number) => void;
  evaporationPercent: number;
  onUpdateEvaporation: (val: number) => void;
  servingsCount: number;
  onUpdateServings: (val: number) => void;
  onLoadPreset: (preset: "galletas" | "mermelada" | "salsa" | "mealprep") => void;
}

const CUSTOM_INGREDIENTS_STORAGE_KEY = "nutrilabel_custom_ingredients_v1";

export const RecipeBuilder: React.FC<RecipeBuilderProps> = ({
  recipeItems,
  onAddItem,
  onRemoveItem,
  onUpdateAmount,
  evaporationPercent,
  onUpdateEvaporation,
  servingsCount,
  onUpdateServings,
  onLoadPreset,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCatalogBrowser, setShowCatalogBrowser] = useState(false);
  const [quickAmounts, setQuickAmounts] = useState<Record<string, string>>({});

  // Custom ingredients persisted in localStorage
  const [customIngredients, setCustomIngredients] = useState<Ingredient[]>([]);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Custom ingredient form state
  const [customName, setCustomName] = useState("");
  const [customSupplier, setCustomSupplier] = useState("Ficha Técnica Proveedor");
  const [customKcal, setCustomKcal] = useState("250");
  const [customFat, setCustomFat] = useState("10");
  const [customSatFat, setCustomSatFat] = useState("2.5");
  const [customCarbs, setCustomCarbs] = useState("30");
  const [customSugars, setCustomSugars] = useState("5");
  const [customFiber, setCustomFiber] = useState("2");
  const [customProtein, setCustomProtein] = useState("8");
  const [customSalt, setCustomSalt] = useState("0.5");
  const [customWeightToAdd, setCustomWeightToAdd] = useState("100");
  const [customAllergens, setCustomAllergens] = useState<AllergenKey[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_INGREDIENTS_STORAGE_KEY);
      if (saved) {
        setCustomIngredients(JSON.parse(saved));
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const allIngredients = useMemo(
    () => [...customIngredients, ...VERIFIED_INGREDIENTS],
    [customIngredients]
  );

  const categories = useMemo(() => {
    const cats = new Set(allIngredients.map((i) => i.category));
    return ["all", ...Array.from(cats)];
  }, [allIngredients]);

  const filteredIngredients = useMemo(() => {
    return allIngredients.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [allIngredients, searchQuery, selectedCategory]);

  const handleQuickAdd = (ing: Ingredient) => {
    const rawAmount = quickAmounts[ing.id] ?? "100";
    const amount = parseFloat(rawAmount);
    if (isNaN(amount) || amount <= 0) return;
    onAddItem(ing, amount);
    setSearchQuery("");
  };

  const toggleCustomAllergen = (allergen: AllergenKey) => {
    setCustomAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    );
  };

  const handleSaveCustomIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const kcal = Math.max(0, parseFloat(customKcal) || 0);
    const kj = Math.round(kcal * 4.184);

    const newIng: Ingredient = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      nameEn: customName.trim(),
      category: "Mis Ingredientes (Proveedor)",
      source: customSupplier.trim() || "Ficha Técnica Proveedor",
      nutrients: {
        energyKj: kj,
        energyKcal: kcal,
        fat: Math.max(0, parseFloat(customFat) || 0),
        saturatedFat: Math.max(0, parseFloat(customSatFat) || 0),
        carbs: Math.max(0, parseFloat(customCarbs) || 0),
        sugars: Math.max(0, parseFloat(customSugars) || 0),
        fiber: Math.max(0, parseFloat(customFiber) || 0),
        protein: Math.max(0, parseFloat(customProtein) || 0),
        salt: Math.max(0, parseFloat(customSalt) || 0),
      },
      allergens: customAllergens,
    };

    const updated = [newIng, ...customIngredients];
    setCustomIngredients(updated);
    try {
      localStorage.setItem(CUSTOM_INGREDIENTS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    const grams = Math.max(1, parseFloat(customWeightToAdd) || 100);
    onAddItem(newIng, grams);

    // Reset modal
    setCustomName("");
    setCustomAllergens([]);
    setIsCustomModalOpen(false);
  };

  const totalRawWeight = recipeItems.reduce((acc, curr) => acc + curr.amountGrams, 0);
  const isDropdownVisible =
    searchQuery.trim().length > 0 || selectedCategory !== "all" || showCatalogBrowser;

  return (
    <div className="space-y-5">
      {/* 1. Compact Preset Strip */}
      <div className="bg-surface border-2 border-primary px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          Recetas de Ejemplo:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: "galletas", label: "Galletas Avena" },
              { id: "mermelada", label: "Mermelada Fresa" },
              { id: "salsa", label: "Salsa Napolitana" },
              { id: "mealprep", label: "Tupper Pollo" },
            ] as const
          ).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onLoadPreset(p.id)}
              className="px-2.5 py-1 text-[11px] font-mono font-semibold border border-primary/35 bg-white hover:bg-primary hover:text-[#F6F3EC] transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Clean Search & Custom Ingredient Bar */}
      <div className="bg-surface border-2 border-primary p-5 shadow-tactile-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-primary">
              Añadir Ingrediente a la Receta
            </h3>
            <Badge variant="mono">{allIngredients.length} EN BASE DE DATOS</Badge>
          </div>

          <button
            type="button"
            onClick={() => setIsCustomModalOpen(!isCustomModalOpen)}
            className="font-mono text-xs font-bold text-accent hover:text-primary flex items-center gap-1.5 bg-white px-3 py-1.5 border border-primary/40 hover:border-primary transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Crear Ingrediente Propio (Ficha Proveedor)</span>
          </button>
        </div>

        {/* Custom Ingredient Drawer (Expandable on demand) */}
        {isCustomModalOpen && (
          <form
            onSubmit={handleSaveCustomIngredient}
            className="mb-4 p-4 bg-[#EAE5D9] border-2 border-primary space-y-4"
          >
            <div className="flex items-center justify-between border-b border-primary/20 pb-2">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase text-accent">
                  NUEVA MATERIA PRIMA PERSONALIZADA (POR 100 G)
                </span>
                <p className="text-xs text-primary font-semibold">
                  Introduce los valores nutricionales por cada 100 g de la ficha técnica de tu proveedor:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="p-1 text-primary hover:text-accent cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-mono text-[11px] font-bold text-primary mb-1">
                  Nombre del Ingrediente (como aparecerá en etiqueta) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cobertura de Chocolate Negro 72% Callebaut"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-primary text-xs font-bold text-primary"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] font-bold text-primary mb-1">
                  Referencia / Proveedor
                </label>
                <input
                  type="text"
                  value={customSupplier}
                  onChange={(e) => setCustomSupplier(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-primary/40 font-mono text-xs text-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block font-mono text-[10px] font-bold text-primary">
                  Energía (kcal/100g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={customKcal}
                  onChange={(e) => setCustomKcal(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-primary/40 font-mono text-xs font-bold"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] font-bold text-primary">
                  Grasas totales (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={customFat}
                  onChange={(e) => setCustomFat(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-primary/40 font-mono text-xs font-bold"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] font-bold text-primary">
                  Saturadas (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={customSatFat}
                  onChange={(e) => setCustomSatFat(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-primary/40 font-mono text-xs font-bold"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] font-bold text-primary">
                  Hidratos carbono (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={customCarbs}
                  onChange={(e) => setCustomCarbs(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-primary/40 font-mono text-xs font-bold"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] font-bold text-primary">
                  Azúcares (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={customSugars}
                  onChange={(e) => setCustomSugars(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-primary/40 font-mono text-xs font-bold"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] font-bold text-primary">
                  Fibra (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={customFiber}
                  onChange={(e) => setCustomFiber(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-primary/40 font-mono text-xs font-bold"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] font-bold text-primary">
                  Proteínas (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={customProtein}
                  onChange={(e) => setCustomProtein(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-primary/40 font-mono text-xs font-bold"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] font-bold text-primary">
                  Sal (g)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={customSalt}
                  onChange={(e) => setCustomSalt(e.target.value)}
                  className="w-full h-8 px-2 bg-white border border-primary/40 font-mono text-xs font-bold"
                />
              </div>
            </div>

            {/* 14 EU Allergens Selector */}
            <div>
              <label className="block font-mono text-[10px] font-bold uppercase text-primary mb-1.5">
                Alérgenos presentes en este ingrediente (Anexo II UE 1169/2011):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(MANDATORY_EU_ALLERGENS) as AllergenKey[]).map((key) => {
                  const active = customAllergens.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleCustomAllergen(key)}
                      className={`px-2 py-1 text-[10px] font-mono border transition-colors cursor-pointer ${
                        active
                          ? "bg-accent text-white border-accent font-bold"
                          : "bg-white text-primary border-primary/25 hover:border-primary"
                      }`}
                    >
                      {active ? "✓ " : ""}
                      {MANDATORY_EU_ALLERGENS[key].nameEs.split(" ")[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-primary/20">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">
                  Cantidad a añadir ahora:
                </span>
                <input
                  type="number"
                  min="1"
                  value={customWeightToAdd}
                  onChange={(e) => setCustomWeightToAdd(e.target.value)}
                  className="w-20 h-9 px-2 bg-white border border-primary font-mono text-xs font-bold text-right"
                />
                <span className="font-mono text-xs">g</span>
              </div>

              <Button type="submit" variant="accent" size="sm">
                <Check className="w-3.5 h-3.5" />
                <span>Guardar e Incorporar a la Receta</span>
              </Button>
            </div>
          </form>
        )}

        {/* Search Input + Category Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <div className="sm:col-span-7 relative">
            <Input
              type="text"
              placeholder="Escribe para buscar entre 158+ ingredientes (ej. harina, pistacho, leche, salmón...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs"
            />
            <Search className="w-4 h-4 text-primary/60 absolute left-3 top-3" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-neutral hover:text-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="sm:col-span-3">
            <select
              aria-label="Filtrar por familia"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                if (e.target.value !== "all") setShowCatalogBrowser(true);
              }}
              className="h-10 w-full bg-white px-2.5 text-xs font-medium text-primary border-2 border-primary/25 focus:border-primary focus:outline-none"
            >
              <option value="all">Todas las familias (14)</option>
              {categories
                .filter((c) => c !== "all")
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={() => setShowCatalogBrowser(!showCatalogBrowser)}
              className="h-10 w-full px-2 bg-white border-2 border-primary/25 hover:border-primary font-mono text-[11px] font-bold text-primary flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>{showCatalogBrowser ? "Ocultar" : "Ver Todo"}</span>
              {showCatalogBrowser ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Progressive Disclosure: Results List only opens when searching or browsing */}
        {isDropdownVisible && (
          <div className="mt-3 max-h-64 overflow-y-auto divide-y divide-primary/10 border-2 border-primary bg-white">
            {filteredIngredients.length === 0 ? (
              <div className="p-6 text-center space-y-2">
                <p className="font-mono text-xs text-neutral">
                  No se encontró &ldquo;{searchQuery}&rdquo; en el catálogo público.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCustomName(searchQuery);
                    setIsCustomModalOpen(true);
                  }}
                >
                  <PlusCircle className="w-3.5 h-3.5 text-accent" />
                  <span>Crear &ldquo;{searchQuery}&rdquo; como Ingrediente Propio</span>
                </Button>
              </div>
            ) : (
              filteredIngredients.map((ing) => (
                <div
                  key={ing.id}
                  className="p-2.5 px-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#F6F3EC]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs text-primary">
                        {ing.name}
                      </span>
                      {ing.allergens.length > 0 && (
                        <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 bg-accent/15 text-accent border border-accent/30">
                          ALÉRGENO: {ing.allergens.join(", ")}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 text-[10px] font-mono text-neutral mt-0.5">
                      <span className="flex items-center gap-1 text-primary/75">
                        <Database className="w-2.5 h-2.5 text-accent" />
                        {ing.source}
                      </span>
                      <span>·</span>
                      <span>{ing.nutrients.energyKcal} kcal</span>
                      <span>·</span>
                      <span>
                        G:{ing.nutrients.fat}g | H:{ing.nutrients.carbs}g | P:{ing.nutrients.protein}g
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      min="1"
                      aria-label={`Gramos de ${ing.name}`}
                      value={quickAmounts[ing.id] ?? "100"}
                      onChange={(e) =>
                        setQuickAmounts({ ...quickAmounts, [ing.id]: e.target.value })
                      }
                      className="w-16 h-8 px-2 bg-[#F6F3EC] border border-primary/40 font-mono text-xs font-bold text-right"
                    />
                    <span className="font-mono text-[10px] text-neutral">g</span>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(ing)}
                      className="h-8 px-3 bg-primary hover:bg-accent text-[#F6F3EC] font-mono text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Añadir</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 3. Active Recipe Table (Clean & Immediate) */}
      <div className="bg-surface border-2 border-primary p-5 shadow-tactile-sm">
        <div className="flex items-center justify-between border-b-2 border-primary/15 pb-3 mb-3">
          <div>
            <h3 className="font-display text-xl font-bold text-primary">
              Escandallo de la Receta ({recipeItems.length} ingredientes)
            </h3>
            <p className="text-xs text-neutral">
              Ordenados automáticamente de mayor a menor peso en la etiqueta final (Art. 18 UE)
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-[10px] text-neutral block">MASA EN CRUDO</span>
            <span className="font-mono text-lg font-extrabold text-primary">
              {totalRawWeight} g
            </span>
          </div>
        </div>

        {recipeItems.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-primary/30 bg-white/50">
            <Scale className="w-7 h-7 text-primary/40 mx-auto mb-1.5" />
            <p className="font-display text-base font-bold text-primary">
              Tu receta está vacía
            </p>
            <p className="text-xs text-neutral mt-0.5">
              Usa el buscador superior o carga una receta de ejemplo.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-primary/10 bg-white border border-primary/20 px-3">
            {recipeItems.map((item, index) => {
              const percentage =
                totalRawWeight > 0
                  ? ((item.amountGrams / totalRawWeight) * 100).toFixed(1)
                  : "0";
              return (
                <div
                  key={`${item.ingredientId}-${index}`}
                  className="py-2.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-neutral">
                        {String(index + 1).padStart(2, "0")}.
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-primary truncate">
                        {item.ingredient.name}
                      </span>
                      {item.ingredient.allergens.length > 0 && (
                        <Badge variant="alert" className="text-[9px] px-1.5 py-0">
                          {item.ingredient.allergens.join(", ")}
                        </Badge>
                      )}
                    </div>
                    <div className="font-mono text-[10px] text-neutral pl-6">
                      {percentage}% del lote · {item.ingredient.source}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        aria-label={`Gramos de ${item.ingredient.name}`}
                        value={item.amountGrams}
                        onChange={(e) =>
                          onUpdateAmount(index, parseFloat(e.target.value) || 0)
                        }
                        className="w-20 py-1 pl-2 pr-6 bg-[#F6F3EC] border border-primary/40 focus:border-primary font-mono text-xs font-bold text-primary text-right focus:outline-none"
                      />
                      <span className="absolute right-2 top-1.5 font-mono text-[10px] text-neutral">
                        g
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      aria-label={`Eliminar ${item.ingredient.name}`}
                      className="p-1.5 text-neutral hover:text-accent transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Compact Merma & Servings Bar right inside the Escandallo Card */}
        <div className="mt-4 pt-4 border-t-2 border-primary/15 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-white border border-primary/20">
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="merma-slider"
                className="font-mono text-[11px] font-bold uppercase text-primary"
              >
                Merma por Cocción / Horneado:
              </label>
              <span className="font-mono text-xs font-extrabold text-accent bg-accent/10 px-2 py-0.5 border border-accent/30">
                -{evaporationPercent}% agua
              </span>
            </div>
            <input
              id="merma-slider"
              type="range"
              min="0"
              max="50"
              step="1"
              value={evaporationPercent}
              onChange={(e) => onUpdateEvaporation(parseInt(e.target.value, 10))}
              className="w-full accent-[#D94E28] cursor-pointer h-1.5 bg-[#EAE5D9]"
            />
            <div className="flex justify-between font-mono text-[9px] text-neutral mt-1">
              <span>0% Crudo</span>
              <span>12% Horno</span>
              <span>22% Mermelada</span>
              <span>45% Secado</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-primary/20 flex items-center justify-between gap-3">
            <div>
              <label
                htmlFor="servings-input"
                className="block font-mono text-[11px] font-bold uppercase text-primary"
              >
                Raciones por Envase:
              </label>
              <span className="font-mono text-[10px] text-neutral">
                {totalRawWeight > 0
                  ? `${((totalRawWeight * (1 - evaporationPercent / 100)) / servingsCount).toFixed(0)} g por ración`
                  : "0 g / ración"}
              </span>
            </div>
            <input
              id="servings-input"
              type="number"
              min="1"
              max="500"
              value={servingsCount}
              onChange={(e) =>
                onUpdateServings(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              className="w-20 h-9 px-2.5 bg-[#F6F3EC] border-2 border-primary font-mono text-sm font-bold text-primary text-center focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
