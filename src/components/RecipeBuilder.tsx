"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  Scale,
  PlusCircle,
  X,
  Check,
  RotateCcw,
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
  lang = "es",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [quickAmounts, setQuickAmounts] = useState<Record<string, string>>({});
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const [customIngredients, setCustomIngredients] = useState<Ingredient[]>([]);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const [customName, setCustomName] = useState("");
  const [customSupplier, setCustomSupplier] = useState("Ficha Proveedor");
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

  const isEn = lang === "en";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_INGREDIENTS_STORAGE_KEY);
      if (saved) {
        setCustomIngredients(JSON.parse(saved));
      }
    } catch {
      // ignore
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
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
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
    setJustAddedId(ing.id);
    setTimeout(() => setJustAddedId(null), 1000);
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
      category: "Personalizados",
      source: customSupplier.trim() || "Ficha Proveedor",
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

    setCustomName("");
    setCustomAllergens([]);
    setIsCustomModalOpen(false);
  };

  const totalRawWeight = recipeItems.reduce(
    (acc, curr) => acc + curr.amountGrams,
    0
  );

  const showSearchResults =
    searchQuery.trim().length > 0 || isCatalogOpen || selectedCategory !== "all";

  return (
    <div className="bg-[#FAF7F2] rounded-2xl border border-[#E2D9C8] shadow-xs p-6 space-y-6">
      {/* Header + Search Bar to Add Ingredients */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base font-bold text-[#231F1D]">
              {isEn ? "2. Recipe Ingredients" : "2. Ingredientes de la receta"}
            </h2>
            <p className="text-xs text-[#6E655F]">
              {isEn
                ? "Search and add ingredients below, or adjust their weight in grams."
                : "Busca para añadir más ingredientes o ajusta los gramos de tu fórmula."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCustomModalOpen(!isCustomModalOpen)}
            className="text-xs font-semibold text-[#4A5D4E] hover:text-[#231F1D] bg-[#E8EDE8] hover:bg-[#DCE4DC] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>
              {isEn ? "Create custom ingredient" : "Añadir ingrediente propio"}
            </span>
          </button>
        </div>

        {/* Custom Ingredient Drawer */}
        {isCustomModalOpen && (
          <form
            onSubmit={handleSaveCustomIngredient}
            className="mb-5 p-5 rounded-xl bg-white border border-[#DCD2C0] space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#231F1D]">
                  {isEn
                    ? "New Custom Ingredient (per 100 g)"
                    : "Nuevo ingrediente propio (valores por 100 g)"}
                </h4>
                <p className="text-xs text-[#6E655F]">
                  {isEn
                    ? "Copy the nutrition values from your supplier's package:"
                    : "Copia los datos de la etiqueta o ficha técnica de tu proveedor:"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                className="p-1 text-[#8C827A] hover:text-[#231F1D] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#5C534C] mb-1">
                  {isEn ? "Ingredient Name *" : "Nombre del ingrediente *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    isEn ? "e.g. 70% Dark Chocolate" : "Ej. Chocolate Negro 70%"
                  }
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-[#FAF7F2] border border-[#DCD2C0] text-xs font-medium text-[#231F1D]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5C534C] mb-1">
                  {isEn ? "Brand / Source" : "Marca / Proveedor"}
                </label>
                <input
                  type="text"
                  value={customSupplier}
                  onChange={(e) => setCustomSupplier(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-[#FAF7F2] border border-[#DCD2C0] text-xs text-[#5C534C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                {
                  label: isEn ? "Calories (kcal)" : "Calorías (kcal)",
                  val: customKcal,
                  set: setCustomKcal,
                },
                {
                  label: isEn ? "Fat (g)" : "Grasas (g)",
                  val: customFat,
                  set: setCustomFat,
                },
                {
                  label: isEn ? "Saturates (g)" : "Saturadas (g)",
                  val: customSatFat,
                  set: setCustomSatFat,
                },
                {
                  label: isEn ? "Carbs (g)" : "Hidratos (g)",
                  val: customCarbs,
                  set: setCustomCarbs,
                },
                {
                  label: isEn ? "Sugars (g)" : "Azúcares (g)",
                  val: customSugars,
                  set: setCustomSugars,
                },
                {
                  label: isEn ? "Fiber (g)" : "Fibra (g)",
                  val: customFiber,
                  set: setCustomFiber,
                },
                {
                  label: isEn ? "Protein (g)" : "Proteínas (g)",
                  val: customProtein,
                  set: setCustomProtein,
                },
                {
                  label: isEn ? "Salt (g)" : "Sal (g)",
                  val: customSalt,
                  set: setCustomSalt,
                },
              ].map((f, i) => (
                <div key={i}>
                  <label className="block text-[11px] font-medium text-[#5C534C] mb-0.5">
                    {f.label}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={f.val}
                    onChange={(e) => f.set(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-lg bg-[#FAF7F2] border border-[#DCD2C0] text-xs font-semibold text-[#231F1D]"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5C534C] mb-1.5">
                {isEn
                  ? "Allergens present (optional):"
                  : "Alérgenos que contiene (opcional):"}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(MANDATORY_EU_ALLERGENS) as AllergenKey[]).map(
                  (key) => {
                    const active = customAllergens.includes(key);
                    const labelText = isEn
                      ? MANDATORY_EU_ALLERGENS[key].nameEn.split(" ")[0]
                      : MANDATORY_EU_ALLERGENS[key].nameEs.split(" ")[0];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleCustomAllergen(key)}
                        className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                          active
                            ? "bg-[#C84B31] text-white font-semibold"
                            : "bg-[#FAF7F2] text-[#5C534C] border border-[#DCD2C0] hover:border-[#B8AD9B]"
                        }`}
                      >
                        {active ? "✓ " : ""}
                        {labelText}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EBE4D8]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#5C534C]">
                  {isEn ? "Grams to add:" : "Gramos a añadir:"}
                </span>
                <input
                  type="number"
                  min="1"
                  value={customWeightToAdd}
                  onChange={(e) => setCustomWeightToAdd(e.target.value)}
                  className="w-20 h-9 px-2.5 rounded-lg bg-[#FAF7F2] border border-[#DCD2C0] text-xs font-semibold text-right"
                />
                <span className="text-xs text-[#6E655F]">g</span>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#C84B31] hover:bg-[#AD3B23] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isEn ? "Save & Add" : "Guardar y añadir"}</span>
              </button>
            </div>
          </form>
        )}

        {/* Search Input + Toggle Catalog Button */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={
                isEn
                  ? "Search 158+ ingredients to add (e.g. flour, milk, olive oil, chicken...)"
                  : "Buscar ingrediente para añadir (ej. harina, leche, aceite, pollo, azúcar...)"
              }
              value={searchQuery}
              onFocus={() => setIsCatalogOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsCatalogOpen(true);
              }}
              className="w-full h-11 pl-10 pr-9 rounded-xl bg-white border border-[#DCD2C0] focus:border-[#C84B31] focus:outline-none text-sm text-[#231F1D] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3.5 text-[#8C827A] hover:text-[#231F1D] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCatalogOpen(!isCatalogOpen)}
            className="h-11 px-4 rounded-xl bg-[#EBE4D8] hover:bg-[#DFD6C7] text-[#3D3733] text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer"
          >
            <span>
              {isCatalogOpen
                ? isEn
                  ? "Hide catalog"
                  : "Ocultar catálogo"
                : isEn
                ? `Browse all (${allIngredients.length})`
                : `Ver catálogo (${allIngredients.length})`}
            </span>
            {isCatalogOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Collapsible Search Results & Category Pills */}
        {showSearchResults && (
          <div className="mt-3 p-3.5 rounded-xl bg-[#F4EFE6] border border-[#DCD2C0] space-y-3">
            {/* Warm Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#231F1D] text-[#FAF7F2] shadow-2xs"
                      : "bg-[#FAF7F2] text-[#5C534C] border border-[#DCD2C0] hover:border-[#B8AD9B]"
                  }`}
                >
                  {cat === "all"
                    ? isEn
                      ? `All (${allIngredients.length})`
                      : `Todos (${allIngredients.length})`
                    : cat}
                </button>
              ))}
            </div>

            <div className="max-h-56 overflow-y-auto divide-y divide-[#EBE4D8] rounded-xl bg-white border border-[#DCD2C0]">
              {filteredIngredients.length === 0 ? (
                <div className="p-6 text-center space-y-2">
                  <p className="text-xs text-[#6E655F]">
                    {isEn
                      ? `No ingredient found matching "${searchQuery}".`
                      : `No hemos encontrado "${searchQuery}".`}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomName(searchQuery);
                      setIsCustomModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#C84B31] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>
                      {isEn
                        ? `Create "${searchQuery}"`
                        : `Crear "${searchQuery}" como ingrediente propio`}
                    </span>
                  </button>
                </div>
              ) : (
                filteredIngredients.map((ing) => {
                  const wasJustAdded = justAddedId === ing.id;
                  const displayName = isEn ? ing.nameEn || ing.name : ing.name;
                  return (
                    <div
                      key={ing.id}
                      className="p-2.5 px-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#FAF7F2] transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-xs sm:text-sm text-[#231F1D]">
                            {displayName}
                          </span>
                          {ing.allergens.length > 0 && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FDF1EE] text-[#9E351E] border border-[#F3D0C7]">
                              {ing.allergens.join(", ")}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#8C827A] mt-0.5">
                          {ing.nutrients.energyKcal} kcal/100g ·{" "}
                          {isEn
                            ? `Fat ${ing.nutrients.fat}g · Carbs ${ing.nutrients.carbs}g · Prot ${ing.nutrients.protein}g`
                            : `Grasas ${ing.nutrients.fat}g · Hidratos ${ing.nutrients.carbs}g · Prot ${ing.nutrients.protein}g`}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number"
                          min="1"
                          aria-label={`Grams of ${displayName}`}
                          value={quickAmounts[ing.id] ?? "100"}
                          onChange={(e) =>
                            setQuickAmounts({
                              ...quickAmounts,
                              [ing.id]: e.target.value,
                            })
                          }
                          className="w-18 h-8 px-2 rounded-lg bg-[#FAF7F2] border border-[#DCD2C0] text-xs font-semibold text-right text-[#231F1D]"
                        />
                        <span className="text-xs text-[#8C827A]">g</span>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(ing)}
                          className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                            wasJustAdded
                              ? "bg-[#4A5D4E] text-white"
                              : "bg-[#C84B31] hover:bg-[#AD3B23] text-white"
                          }`}
                        >
                          {wasJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{isEn ? "Added" : "Añadido"}</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>{isEn ? "Add" : "Añadir"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <hr className="border-[#E5DEC9]" />

      {/* Active Recipe Items List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-[#5C534C]">
            {isEn
              ? `Added Ingredients (${recipeItems.length}) — Total: ${totalRawWeight} g`
              : `Ingredientes en la receta (${recipeItems.length}) — Peso bruto: ${totalRawWeight} g`}
          </span>

          {recipeItems.length > 0 && (
            <button
              type="button"
              onClick={onStartBlank}
              className="text-xs text-[#8C827A] hover:text-[#C84B31] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isEn ? "Clear all" : "Vaciar receta"}</span>
            </button>
          )}
        </div>

        {recipeItems.length === 0 ? (
          <div className="py-10 px-4 text-center rounded-xl border border-dashed border-[#D5CBB8] bg-white/60">
            <Scale className="w-7 h-7 text-[#8C827A] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#231F1D]">
              {isEn
                ? "Your recipe is empty"
                : "Tu lista de ingredientes está vacía"}
            </p>
            <p className="text-xs text-[#6E655F] mt-0.5">
              {isEn
                ? "Use the search bar above to add your first ingredient."
                : "Usa el buscador de arriba para ir añadiendo los ingredientes de tu elaboración."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#EBE4D8] rounded-xl border border-[#DCD2C0] bg-white px-4">
            {recipeItems.map((item, index) => {
              const percentage =
                totalRawWeight > 0
                  ? ((item.amountGrams / totalRawWeight) * 100).toFixed(0)
                  : "0";
              const displayName = isEn
                ? item.ingredient.nameEn || item.ingredient.name
                : item.ingredient.name;
              return (
                <div
                  key={`${item.ingredientId}-${index}`}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-[#231F1D] truncate">
                        {displayName}
                      </span>
                      {item.ingredient.allergens.length > 0 && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FDF1EE] text-[#9E351E] border border-[#F3D0C7]">
                          {item.ingredient.allergens.join(", ")}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#8C827A]">
                      {percentage}% · {item.ingredient.nutrients.energyKcal} kcal/100g
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        aria-label={`Grams of ${displayName}`}
                        value={item.amountGrams}
                        onChange={(e) =>
                          onUpdateAmount(index, parseFloat(e.target.value) || 0)
                        }
                        className="w-22 h-9 pl-2.5 pr-6 rounded-lg bg-[#FAF7F2] border border-[#DCD2C0] focus:border-[#C84B31] text-xs font-semibold text-[#231F1D] text-right focus:outline-none"
                      />
                      <span className="absolute right-2.5 top-2.5 text-xs text-[#8C827A]">
                        g
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      aria-label={`Remove ${displayName}`}
                      className="p-1.5 text-[#8C827A] hover:text-[#C84B31] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Warm Cooking Loss & Servings Controls */}
      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#DCD2C0]">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="merma-slider"
              className="text-xs font-semibold text-[#3D3733]"
            >
              {isEn ? "Water loss in cooking/baking" : "Pérdida de agua al cocinar"}
            </label>
            <span className="text-xs font-bold text-[#C84B31] bg-[#FDF1EE] px-2 py-0.5 rounded-md">
              -{evaporationPercent}%
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
            className="w-full accent-[#C84B31] cursor-pointer h-1.5 bg-[#EBE4D8] rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-[#8C827A] mt-1.5">
            <span>{isEn ? "0% Raw" : "0% Crudo"}</span>
            <span>{isEn ? "12% Baked" : "12% Horno"}</span>
            <span>{isEn ? "22% Jam" : "22% Cocción"}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#DCD2C0] flex items-center justify-between gap-3">
          <div>
            <label
              htmlFor="servings-input"
              className="block text-xs font-semibold text-[#3D3733]"
            >
              {isEn ? "Servings per package" : "Raciones por envase"}
            </label>
            <span className="text-xs text-[#8C827A]">
              {totalRawWeight > 0
                ? `${(
                    (totalRawWeight * (1 - evaporationPercent / 100)) /
                    servingsCount
                  ).toFixed(0)} g / ${isEn ? "serving" : "ración"}`
                : `0 g / ${isEn ? "serving" : "ración"}`}
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
            className="w-20 h-9 px-2.5 rounded-lg bg-[#FAF7F2] border border-[#DCD2C0] text-sm font-semibold text-[#231F1D] text-center focus:border-[#C84B31] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
