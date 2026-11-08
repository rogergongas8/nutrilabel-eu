"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  PlusCircle,
  X,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Ingredient,
  RecipeItem,
  AllergenKey,
  MANDATORY_EU_ALLERGENS,
} from "@/types/nutrition";
import { VERIFIED_INGREDIENTS } from "@/data/ingredients";

interface RecipeBuilderProps {
  recipeItems: RecipeItem[];
  onAddItem: (ingredient: Ingredient, amountGrams: number) => void;
  onRemoveItem: (index: number) => void;
  onUpdateAmount: (index: number, newAmount: number) => void;
  evaporationPercent: number;
  onUpdateEvaporation: (val: number) => void;
  servingsCount: number;
  onUpdateServings: (val: number) => void;
  onStartBlank: () => void;
  lang?: "es" | "en";
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
  onStartBlank,
  lang = "en",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [showYieldSettings, setShowYieldSettings] = useState(false);
  const [quickAmounts, setQuickAmounts] = useState<Record<string, string>>({});
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const [customIngredients, setCustomIngredients] = useState<Ingredient[]>([]);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const [customName, setCustomName] = useState("");
  const [customKcal, setCustomKcal] = useState("250");
  const [customFat, setCustomFat] = useState("10");
  const [customSatFat, setCustomSatFat] = useState("2.5");
  const [customCarbs, setCustomCarbs] = useState("30");
  const [customSugars, setCustomSugars] = useState("5");
  const [customProtein, setCustomProtein] = useState("8");
  const [customSalt, setCustomSalt] = useState("0.5");
  const [customWeightToAdd, setCustomWeightToAdd] = useState("100");
  const [customAllergens, setCustomAllergens] = useState<AllergenKey[]>([]);

  const isEn = lang === "en";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_INGREDIENTS_STORAGE_KEY);
      if (saved) setCustomIngredients(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const allIngredients = useMemo(
    () => [...customIngredients, ...VERIFIED_INGREDIENTS],
    [customIngredients]
  );

  const filteredIngredients = useMemo(() => {
    return allIngredients.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [allIngredients, searchQuery]);

  const handleQuickAdd = (ing: Ingredient) => {
    const rawAmount = quickAmounts[ing.id] ?? "100";
    const amount = parseFloat(rawAmount);
    if (isNaN(amount) || amount <= 0) return;
    onAddItem(ing, amount);
    setJustAddedId(ing.id);
    setTimeout(() => setJustAddedId(null), 900);
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
    const newIng: Ingredient = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      nameEn: customName.trim(),
      category: "Custom",
      source: "Custom",
      nutrients: {
        energyKj: Math.round(kcal * 4.184),
        energyKcal: kcal,
        fat: Math.max(0, parseFloat(customFat) || 0),
        saturatedFat: Math.max(0, parseFloat(customSatFat) || 0),
        carbs: Math.max(0, parseFloat(customCarbs) || 0),
        sugars: Math.max(0, parseFloat(customSugars) || 0),
        fiber: 0,
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

    onAddItem(newIng, Math.max(1, parseFloat(customWeightToAdd) || 100));
    setCustomName("");
    setCustomAllergens([]);
    setIsCustomModalOpen(false);
  };

  const totalRawWeight = recipeItems.reduce(
    (acc, curr) => acc + curr.amountGrams,
    0
  );

  const showSearchResults = searchQuery.trim().length > 0 || isCatalogOpen;

  return (
    <div className="bg-white rounded-xl border border-neutral-200/90 p-5 space-y-5">
      {/* Search Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-neutral-500">
            {isEn ? "Ingredients" : "Ingredientes"}
          </span>
          <button
            type="button"
            onClick={() => setIsCustomModalOpen(!isCustomModalOpen)}
            className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{isEn ? "Custom ingredient" : "Ingrediente propio"}</span>
          </button>
        </div>

        {/* Custom Ingredient Drawer */}
        {isCustomModalOpen && (
          <form
            onSubmit={handleSaveCustomIngredient}
            className="mb-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-900">
                {isEn
                  ? "New Ingredient (values per 100g)"
                  : "Nuevo ingrediente (valores por 100g)"}
              </span>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              required
              placeholder={isEn ? "Ingredient name" : "Nombre del ingrediente"}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-white border border-neutral-200 text-xs text-neutral-900"
            />

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[
                { label: "kcal", val: customKcal, set: setCustomKcal },
                { label: isEn ? "Fat" : "Grasa", val: customFat, set: setCustomFat },
                { label: isEn ? "Sat." : "Sat.", val: customSatFat, set: setCustomSatFat },
                { label: isEn ? "Carbs" : "Hidr.", val: customCarbs, set: setCustomCarbs },
                { label: isEn ? "Sugar" : "Azúc.", val: customSugars, set: setCustomSugars },
                { label: isEn ? "Prot." : "Prot.", val: customProtein, set: setCustomProtein },
              ].map((f, i) => (
                <div key={i}>
                  <label className="block text-[10px] text-neutral-500 mb-0.5">
                    {f.label}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={f.val}
                    onChange={(e) => f.set(e.target.value)}
                    className="w-full h-8 px-2 rounded-md bg-white border border-neutral-200 text-xs text-neutral-900"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1">
              {(Object.keys(MANDATORY_EU_ALLERGENS) as AllergenKey[]).map((key) => {
                const active = customAllergens.includes(key);
                const labelText = isEn
                  ? MANDATORY_EU_ALLERGENS[key].nameEn.split(" ")[0]
                  : MANDATORY_EU_ALLERGENS[key].nameEs.split(" ")[0];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleCustomAllergen(key)}
                    className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                      active
                        ? "bg-neutral-900 text-white"
                        : "bg-white text-neutral-600 border border-neutral-200"
                    }`}
                  >
                    {labelText}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-neutral-500">
                  {isEn ? "Grams:" : "Gramos:"}
                </span>
                <input
                  type="number"
                  min="1"
                  value={customWeightToAdd}
                  onChange={(e) => setCustomWeightToAdd(e.target.value)}
                  className="w-16 h-8 px-2 rounded-md bg-white border border-neutral-200 text-xs text-right"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-medium cursor-pointer"
              >
                {isEn ? "Save & Add" : "Guardar"}
              </button>
            </div>
          </form>
        )}

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={
                isEn
                  ? "Search ingredient to add (flour, milk, olive oil...)"
                  : "Buscar ingrediente (harina, leche, aceite...)"
              }
              value={searchQuery}
              onFocus={() => setIsCatalogOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsCatalogOpen(true);
              }}
              className="w-full h-10 pl-9 pr-8 rounded-lg bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-neutral-900 focus:outline-none text-xs sm:text-sm text-neutral-900 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-3 text-neutral-400 hover:text-neutral-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCatalogOpen(!isCatalogOpen)}
            className="h-10 px-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
          >
            <span>{isCatalogOpen ? (isEn ? "Close" : "Cerrar") : (isEn ? "Browse" : "Lista")}</span>
            {isCatalogOpen ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Dropdown Results */}
        {showSearchResults && (
          <div className="mt-2 max-h-52 overflow-y-auto divide-y divide-neutral-100 rounded-lg bg-white border border-neutral-200 shadow-sm">
            {filteredIngredients.map((ing) => {
              const wasJustAdded = justAddedId === ing.id;
              const displayName = isEn ? ing.nameEn || ing.name : ing.name;
              return (
                <div
                  key={ing.id}
                  className="p-2.5 px-3 flex items-center justify-between gap-2 hover:bg-neutral-50"
                >
                  <div className="min-w-0">
                    <span className="font-medium text-xs text-neutral-900 block truncate">
                      {displayName}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {ing.nutrients.energyKcal} kcal / 100g
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      min="1"
                      value={quickAmounts[ing.id] ?? "100"}
                      onChange={(e) =>
                        setQuickAmounts({
                          ...quickAmounts,
                          [ing.id]: e.target.value,
                        })
                      }
                      className="w-16 h-7 px-2 rounded bg-neutral-50 border border-neutral-200 text-xs text-right"
                    />
                    <span className="text-[11px] text-neutral-400">g</span>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(ing)}
                      className="h-7 px-2.5 rounded bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium flex items-center gap-1 cursor-pointer"
                    >
                      {wasJustAdded ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Plus className="w-3 h-3" />
                      )}
                      <span>{isEn ? "Add" : "Añadir"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Clean Recipe List */}
      {recipeItems.length === 0 ? (
        <div className="py-8 text-center rounded-lg border border-dashed border-neutral-200 text-xs text-neutral-400">
          {isEn
            ? "No ingredients yet. Search above to add ingredients."
            : "Sin ingredientes. Usa el buscador de arriba para añadir."}
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {recipeItems.map((item, index) => {
            const displayName = isEn
              ? item.ingredient.nameEn || item.ingredient.name
              : item.ingredient.name;
            return (
              <div
                key={`${item.ingredientId}-${index}`}
                className="py-2.5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium text-neutral-900 truncate block">
                    {displayName}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={item.amountGrams}
                      onChange={(e) =>
                        onUpdateAmount(index, parseFloat(e.target.value) || 0)
                      }
                      className="w-20 h-8 pl-2 pr-6 rounded-lg bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-neutral-900 text-xs font-medium text-neutral-900 text-right focus:outline-none"
                    />
                    <span className="absolute right-2 top-2 text-xs text-neutral-400">
                      g
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(index)}
                    className="p-1 text-neutral-300 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compact Footer Bar with Collapsible Servings & Baking Loss */}
      <div className="pt-3 border-t border-neutral-100">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>
            {isEn ? "Total weight:" : "Peso total:"}{" "}
            <strong className="text-neutral-900">{totalRawWeight} g</strong>
          </span>

          <button
            type="button"
            onClick={() => setShowYieldSettings(!showYieldSettings)}
            className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
          >
            <span>
              {isEn
                ? `Servings (${servingsCount}) & cooking loss (-${evaporationPercent}%)`
                : `Raciones (${servingsCount}) y merma (-${evaporationPercent}%)`}
            </span>
            {showYieldSettings ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {showYieldSettings && (
          <div className="mt-3 pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/70">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-neutral-600">
                  {isEn ? "Water loss in cooking" : "Pérdida de agua al cocinar"}
                </span>
                <strong className="text-neutral-900">-{evaporationPercent}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={evaporationPercent}
                onChange={(e) =>
                  onUpdateEvaporation(parseInt(e.target.value, 10))
                }
                className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
              />
            </div>

            <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/70 flex items-center justify-between">
              <span className="text-xs text-neutral-600">
                {isEn ? "Servings per pack" : "Raciones por envase"}
              </span>
              <input
                type="number"
                min="1"
                max="500"
                value={servingsCount}
                onChange={(e) =>
                  onUpdateServings(
                    Math.max(1, parseInt(e.target.value, 10) || 1)
                  )
                }
                className="w-16 h-8 px-2 rounded bg-white border border-neutral-200 text-xs font-medium text-center"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
