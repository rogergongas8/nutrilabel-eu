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
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import {
  Ingredient,
  RecipeItem,
  AllergenKey,
  MANDATORY_EU_ALLERGENS,
} from "@/types/nutrition";
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
  onStartBlank: () => void;
  onScrollToLabel: () => void;
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
  onScrollToLabel,
  lang = "es",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [quickAmounts, setQuickAmounts] = useState<Record<string, string>>({});
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Custom ingredients persisted in localStorage
  const [customIngredients, setCustomIngredients] = useState<Ingredient[]>([]);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Custom ingredient form state
  const [customName, setCustomName] = useState("");
  const [customSupplier, setCustomSupplier] = useState("Supplier Spec Sheet");
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
    setTimeout(() => setJustAddedId(null), 1200);
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
      category: "Custom (Supplier)",
      source: customSupplier.trim() || "Supplier Spec Sheet",
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

  return (
    <div className="space-y-6">
      {/* PASO 2A: Buscador Claro y Directo para Añadir Ingredientes */}
      <div className="bg-surface border-2 border-primary p-5 shadow-tactile-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-primary text-[#F6F3EC] font-mono text-[10px] font-bold uppercase">
                {isEn ? "STEP 2 OF 3" : "PASO 2 DE 3"}
              </span>
              <h3 className="font-display text-xl font-bold text-primary">
                {isEn
                  ? "Search & Add Your Ingredients"
                  : "Busca y añade tus ingredientes"}
              </h3>
            </div>
            <p className="text-xs text-neutral mt-1">
              {isEn ? (
                <>
                  Choose from <strong>{allIngredients.length} official ingredients</strong>, enter grams, and click <strong>&ldquo;+ Add&rdquo;</strong>:
                </>
              ) : (
                <>
                  Elige entre <strong>{allIngredients.length} ingredientes oficiales</strong>, pon los gramos que usas y pulsa <strong>&ldquo;+ Añadir&rdquo;</strong>:
                </>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCustomModalOpen(!isCustomModalOpen)}
            className="font-mono text-xs font-bold text-accent hover:text-primary flex items-center gap-1.5 bg-white px-3 py-2 border-2 border-primary/40 hover:border-primary transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>
              {isEn
                ? "+ Create Custom Ingredient"
                : "¿No está tu ingrediente? Créalo aquí"}
            </span>
          </button>
        </div>

        {/* Custom Ingredient Drawer */}
        {isCustomModalOpen && (
          <form
            onSubmit={handleSaveCustomIngredient}
            className="mb-4 p-4 bg-[#EAE5D9] border-2 border-primary space-y-4"
          >
            <div className="flex items-center justify-between border-b border-primary/20 pb-2">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase text-accent">
                  {isEn
                    ? "CREATE CUSTOM INGREDIENT (VALUES PER 100 G)"
                    : "CREAR INGREDIENTE PERSONALIZADO (VALORES POR 100 G)"}
                </span>
                <p className="text-xs text-primary font-semibold">
                  {isEn
                    ? "Enter the nutrition values per 100 g from your supplier's package or spec sheet:"
                    : "Copia los datos nutricionales por cada 100 g del envase o ficha de tu proveedor:"}
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
                  {isEn ? "Ingredient Name *" : "Nombre del Ingrediente *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    isEn
                      ? "e.g. 70% Dark Chocolate Couverture"
                      : "Ej. Chocolate Negro 70% Especial Obrador"
                  }
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-primary text-xs font-bold text-primary"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] font-bold text-primary mb-1">
                  {isEn ? "Brand / Supplier" : "Marca / Proveedor"}
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
                  {isEn ? "Calories (kcal/100g)" : "Calorías (kcal/100g)"}
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
                  {isEn ? "Total Fat (g)" : "Grasas totales (g)"}
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
                  {isEn ? "Saturates (g)" : "Saturadas (g)"}
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
                  {isEn ? "Carbohydrates (g)" : "Hidratos carbono (g)"}
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
                  {isEn ? "Sugars (g)" : "Azúcares (g)"}
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
                  {isEn ? "Fiber (g)" : "Fibra (g)"}
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
                  {isEn ? "Protein (g)" : "Proteínas (g)"}
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
                  {isEn ? "Salt (g)" : "Sal (g)"}
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

            <div>
              <label className="block font-mono text-[10px] font-bold uppercase text-primary mb-1.5">
                {isEn
                  ? "Contains any of the 14 mandatory EU allergens? (Click if applicable):"
                  : "¿Contiene algún alérgeno obligatorio? (Pulsa si aplica):"}
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
                        className={`px-2 py-1 text-[10px] font-mono border transition-colors cursor-pointer ${
                          active
                            ? "bg-accent text-white border-accent font-bold"
                            : "bg-white text-primary border-primary/25 hover:border-primary"
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

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-primary/20">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">
                  {isEn ? "Grams to add to recipe:" : "Gramos a añadir a la receta:"}
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
                <span>
                  {isEn ? "Save & Add to Recipe" : "Guardar y Añadir a Mi Receta"}
                </span>
              </Button>
            </div>
          </form>
        )}

        {/* Search Input */}
        <div className="relative mb-3">
          <Input
            type="text"
            placeholder={
              isEn
                ? "🔍 Type to search any ingredient in English or Spanish (e.g. flour, milk, olive oil, chicken, sugar, almond...)"
                : "🔍 Escribe aquí para buscar un ingrediente (ej. harina, leche, aceite, pollo, azúcar, almendra...)"
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 pr-10 h-11 text-sm font-medium border-2 border-primary"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-3.5 text-neutral hover:text-primary cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Search className="w-4 h-4 text-primary/60 absolute right-3.5 top-3.5" />
          )}
        </div>

        {/* Clickable Family Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-[11px] font-mono font-bold whitespace-nowrap border transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary text-[#F6F3EC] border-primary"
                  : "bg-white text-primary border-primary/25 hover:border-primary"
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

        {/* Always-Visible Compact Ingredient Selector */}
        <div className="max-h-56 overflow-y-auto divide-y divide-primary/10 border-2 border-primary bg-white">
          {filteredIngredients.length === 0 ? (
            <div className="p-6 text-center space-y-2">
              <p className="font-mono text-xs text-neutral">
                {isEn
                  ? `No ingredient found matching "${searchQuery}".`
                  : `No hemos encontrado "${searchQuery}".`}
              </p>
              <Button
                type="button"
                variant="accent"
                size="sm"
                onClick={() => {
                  setCustomName(searchQuery);
                  setIsCustomModalOpen(true);
                }}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>
                  {isEn
                    ? `Create "${searchQuery}" as Custom Ingredient`
                    : `Crear "${searchQuery}" como Ingrediente Nuevo`}
                </span>
              </Button>
            </div>
          ) : (
            filteredIngredients.map((ing) => {
              const wasJustAdded = justAddedId === ing.id;
              const displayName = isEn ? ing.nameEn || ing.name : ing.name;
              return (
                <div
                  key={ing.id}
                  className="p-2.5 px-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#F6F3EC]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-primary">
                        {displayName}
                      </span>
                      {ing.allergens.length > 0 && (
                        <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 bg-accent/15 text-accent border border-accent/30">
                          {isEn ? "ALLERGEN:" : "ALÉRGENO:"}{" "}
                          {ing.allergens.join(", ")}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 text-[10px] font-mono text-neutral mt-0.5">
                      <span>{ing.nutrients.energyKcal} kcal/100g</span>
                      <span>·</span>
                      <span>
                        {isEn
                          ? `Fat: ${ing.nutrients.fat}g | Carbs: ${ing.nutrients.carbs}g | Prot: ${ing.nutrients.protein}g`
                          : `Grasas: ${ing.nutrients.fat}g | Hidratos: ${ing.nutrients.carbs}g | Prot: ${ing.nutrients.protein}g`}
                      </span>
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
                      className="w-20 h-8 px-2 bg-[#F6F3EC] border border-primary/50 font-mono text-xs font-bold text-right"
                    />
                    <span className="font-mono text-xs font-bold text-primary">
                      g
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(ing)}
                      className={`h-8 px-3 font-mono text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                        wasJustAdded
                          ? "bg-emerald-700 text-white"
                          : "bg-accent hover:bg-primary text-white"
                      }`}
                    >
                      {wasJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{isEn ? "Added!" : "¡Añadido!"}</span>
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

      {/* PASO 2B: Tu Receta Activa + Botón de Generar/Ver Etiqueta */}
      <div className="bg-surface border-2 border-primary p-5 shadow-tactile-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-primary/15 pb-3 mb-3">
          <div>
            <h3 className="font-display text-xl font-bold text-primary">
              {isEn
                ? `Ingredients in Your Recipe (${recipeItems.length})`
                : `Ingredientes en tu Receta (${recipeItems.length})`}
            </h3>
            <p className="text-xs text-neutral">
              {isEn
                ? "Edit grams below at any time — the nutrition label updates live:"
                : "Puedes cambiar los gramos de cualquier ingrediente aquí mismo y la etiqueta se recalcula al instante:"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {recipeItems.length > 0 && (
              <button
                type="button"
                onClick={onStartBlank}
                className="px-2.5 py-1 text-[11px] font-mono font-bold text-accent hover:bg-accent/10 border border-accent/40 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isEn ? "Clear Recipe" : "Vaciar Receta"}</span>
              </button>
            )}
            <div className="text-right">
              <span className="font-mono text-[10px] text-neutral block">
                {isEn ? "TOTAL RAW WEIGHT" : "PESO TOTAL RECETA"}
              </span>
              <span className="font-mono text-lg font-extrabold text-primary">
                {totalRawWeight} g
              </span>
            </div>
          </div>
        </div>

        {recipeItems.length === 0 ? (
          <div className="py-10 px-4 text-center border-2 border-dashed border-primary/30 bg-white">
            <Scale className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="font-display text-lg font-bold text-primary">
              {isEn
                ? "Your recipe is ready to start from scratch"
                : "Tu receta está lista para empezar en blanco"}
            </p>
            <p className="text-xs text-neutral mt-1 max-w-md mx-auto">
              {isEn ? (
                <>
                  Click the orange <strong>&ldquo;+ Add&rdquo;</strong> button next to any ingredient above to build your product.
                </>
              ) : (
                <>
                  Haz clic en el botón naranja <strong>&ldquo;+ Añadir&rdquo;</strong> junto a cualquier ingrediente del cuadro de arriba para ir armando tu producto.
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-primary/10 bg-white border border-primary/20 px-3">
            {recipeItems.map((item, index) => {
              const percentage =
                totalRawWeight > 0
                  ? ((item.amountGrams / totalRawWeight) * 100).toFixed(1)
                  : "0";
              const displayName = isEn
                ? item.ingredient.nameEn || item.ingredient.name
                : item.ingredient.name;
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
                        {displayName}
                      </span>
                      {item.ingredient.allergens.length > 0 && (
                        <Badge variant="alert" className="text-[9px] px-1.5 py-0">
                          {item.ingredient.allergens.join(", ")}
                        </Badge>
                      )}
                    </div>
                    <div className="font-mono text-[10px] text-neutral pl-6">
                      {percentage}% {isEn ? "of batch" : "de la receta"} ·{" "}
                      {item.ingredient.nutrients.energyKcal} kcal/100g
                    </div>
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
                        className="w-20 py-1 pl-2 pr-6 bg-[#F6F3EC] border border-primary/40 focus:border-primary font-mono text-xs font-bold text-primary text-right focus:outline-none"
                      />
                      <span className="absolute right-2 top-1.5 font-mono text-[10px] text-neutral">
                        g
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      aria-label={`Remove ${displayName}`}
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

        {/* Merma & Raciones */}
        <div className="mt-4 pt-4 border-t-2 border-primary/15 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-white border border-primary/20">
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="merma-slider"
                className="font-mono text-[11px] font-bold uppercase text-primary"
              >
                {isEn
                  ? "Cooking / Baking Moisture Loss:"
                  : "¿Pierde agua al cocinar/hornear?"}
              </label>
              <span className="font-mono text-xs font-extrabold text-accent bg-accent/10 px-2 py-0.5 border border-accent/30">
                -{evaporationPercent}% {isEn ? "water" : "agua"}
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
              <span>{isEn ? "0% Raw" : "0% Sin cocción"}</span>
              <span>{isEn ? "12% Baked" : "12% Horno"}</span>
              <span>{isEn ? "22% Jam" : "22% Mermelada"}</span>
              <span>{isEn ? "45% Dried" : "45% Secado"}</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-primary/20 flex items-center justify-between gap-3">
            <div>
              <label
                htmlFor="servings-input"
                className="block font-mono text-[11px] font-bold uppercase text-primary"
              >
                {isEn ? "Servings per Package:" : "¿Cuántas raciones salen?"}
              </label>
              <span className="font-mono text-[10px] text-neutral">
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
              className="w-20 h-9 px-2.5 bg-[#F6F3EC] border-2 border-primary font-mono text-sm font-bold text-primary text-center focus:outline-none"
            />
          </div>
        </div>

        {/* Big Clear Action Button to Jump to / Highlight the Generated Label */}
        {recipeItems.length > 0 && (
          <div className="mt-5 pt-4 border-t-2 border-primary">
            <button
              type="button"
              onClick={onScrollToLabel}
              className="w-full h-12 bg-primary hover:bg-accent text-[#F6F3EC] font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-tactile-sm cursor-pointer"
            >
              <span>
                {isEn
                  ? "✓ Label Ready: Go to Download (.PNG / .SVG)"
                  : "✓ Etiqueta Lista: Ir a Descargar (.PNG / .SVG)"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
