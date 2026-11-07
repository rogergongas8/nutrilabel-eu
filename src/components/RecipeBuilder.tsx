"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Trash2,
  Database,
  Sliders,
  Sparkles,
  Scale,
} from "lucide-react";
import { Ingredient, RecipeItem } from "@/types/nutrition";
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
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [amountInput, setAmountInput] = useState<string>("100");

  const categories = useMemo(() => {
    const cats = new Set(VERIFIED_INGREDIENTS.map((i) => i.category));
    return ["all", ...Array.from(cats)];
  }, []);

  const filteredIngredients = useMemo(() => {
    return VERIFIED_INGREDIENTS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const handleAdd = () => {
    if (!selectedIngredient) return;
    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) return;

    onAddItem(selectedIngredient, amount);
    setSelectedIngredient(null);
    setSearchQuery("");
    setAmountInput("100");
  };

  const totalRawWeight = recipeItems.reduce((acc, curr) => acc + curr.amountGrams, 0);

  return (
    <div className="space-y-8">
      {/* Preset Recipes Bar */}
      <div className="bg-surface border-2 border-primary p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Plantillas de Obrador Reales:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onLoadPreset("galletas")}
              className="px-3 py-1 text-xs font-mono font-semibold border border-primary/40 bg-white hover:bg-primary hover:text-[#F6F3EC] transition-colors cursor-pointer"
            >
              01. Galletas Avena
            </button>
            <button
              type="button"
              onClick={() => onLoadPreset("mermelada")}
              className="px-3 py-1 text-xs font-mono font-semibold border border-primary/40 bg-white hover:bg-primary hover:text-[#F6F3EC] transition-colors cursor-pointer"
            >
              02. Mermelada Artesana
            </button>
            <button
              type="button"
              onClick={() => onLoadPreset("salsa")}
              className="px-3 py-1 text-xs font-mono font-semibold border border-primary/40 bg-white hover:bg-primary hover:text-[#F6F3EC] transition-colors cursor-pointer"
            >
              03. Salsa Napolitana
            </button>
            <button
              type="button"
              onClick={() => onLoadPreset("mealprep")}
              className="px-3 py-1 text-xs font-mono font-semibold border border-primary/40 bg-white hover:bg-primary hover:text-[#F6F3EC] transition-colors cursor-pointer"
            >
              04. Tupper Fitness Pollo
            </button>
          </div>
        </div>
      </div>

      {/* Paso 1: Catálogo Oficial BEDCA / USDA */}
      <div className="bg-surface border-2 border-primary p-6 shadow-tactile-sm">
        <div className="flex items-baseline justify-between border-b-2 border-primary/15 pb-4 mb-5">
          <div>
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
              FASE 01 // CATÁLOGO OFICIAL
            </span>
            <h3 className="font-display text-2xl font-bold text-primary mt-1">
              Buscador de Materias Primas Acreditadas
            </h3>
          </div>
          <Badge variant="mono">{VERIFIED_INGREDIENTS.length} ACTIVOS</Badge>
        </div>

        {/* Search & Category Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Input
              type="text"
              placeholder="Buscar ingrediente o código BEDCA (ej. harina, miel, AOVE, almendra...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="w-4 h-4 text-primary/60 absolute left-3.5 top-3.5" />
          </div>

          <div className="sm:col-span-4">
            <select
              aria-label="Filtrar por categoría de alimento"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-11 w-full bg-white px-3 text-sm font-medium text-primary border-2 border-primary/25 focus:border-primary focus:outline-none"
            >
              <option value="all">Todas las familias</option>
              {categories
                .filter((c) => c !== "all")
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Ingredients Table List */}
        <div className="mt-4 max-h-60 overflow-y-auto divide-y divide-primary/10 border-2 border-primary/20 bg-white">
          {filteredIngredients.length === 0 ? (
            <div className="p-8 text-center font-mono text-xs text-neutral">
              No se han encontrado materias primas con ese criterio.
            </div>
          ) : (
            filteredIngredients.map((ing) => {
              const isSelected = selectedIngredient?.id === ing.id;
              return (
                <div
                  key={ing.id}
                  onClick={() => setSelectedIngredient(ing)}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#F6F3EC] border-l-4 border-accent"
                      : "hover:bg-[#F6F3EC]/60"
                  }`}
                >
                  <div className="pr-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-primary">
                        {ing.name}
                      </span>
                      {ing.allergens.length > 0 && (
                        <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 bg-accent/15 text-accent border border-accent/30">
                          ALÉRGENO: {ing.allergens.join(", ")}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-neutral mt-1">
                      <span className="flex items-center gap-1 text-primary/80 font-medium">
                        <Database className="w-3 h-3 text-accent" />
                        {ing.source}
                      </span>
                      <span>·</span>
                      <span>{ing.nutrients.energyKcal} kcal/100g</span>
                      <span>·</span>
                      <span>
                        G:{ing.nutrients.fat}g | H:{ing.nutrients.carbs}g | P:{ing.nutrients.protein}g
                      </span>
                    </div>
                  </div>

                  <span
                    className={`font-mono text-xs uppercase px-3 py-1 font-bold border ${
                      isSelected
                        ? "bg-primary text-[#F6F3EC] border-primary"
                        : "bg-surface text-primary border-primary/30"
                    }`}
                  >
                    {isSelected ? "Elegido" : "+ Usar"}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Add Selected Ingredient Bar */}
        {selectedIngredient && (
          <div className="mt-4 p-4 bg-[#EAE5D9] border-2 border-primary flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
                MATERIA PRIMA SELECCIONADA
              </span>
              <p className="font-display text-lg font-bold text-primary">
                {selectedIngredient.name}
              </p>
              <p className="font-mono text-xs text-neutral">
                Referencia oficial: {selectedIngredient.source}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step="1"
                  aria-label="Peso en gramos"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-28 h-11 pl-3 pr-8 bg-white border-2 border-primary font-mono text-base font-bold text-primary text-right focus:outline-none"
                />
                <span className="absolute right-3 top-3 font-mono text-xs font-bold text-neutral">
                  g
                </span>
              </div>

              <Button variant="accent" size="md" onClick={handleAdd}>
                <Plus className="w-4 h-4" />
                <span>Incorporar al Lote</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Paso 2: Escandallo de Formulación en Crudo */}
      <div className="bg-surface border-2 border-primary p-6 shadow-tactile-sm">
        <div className="flex items-baseline justify-between border-b-2 border-primary/15 pb-4 mb-4">
          <div>
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
              FASE 02 // ESCANDALLO PONDERADO
            </span>
            <h3 className="font-display text-2xl font-bold text-primary mt-1">
              Composición del Lote en Crudo
            </h3>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs text-neutral block">MASA CRUDA TOTAL</span>
            <span className="font-mono text-xl font-extrabold text-primary">
              {totalRawWeight} g
            </span>
          </div>
        </div>

        {recipeItems.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-primary/30 bg-white/50">
            <Scale className="w-8 h-8 text-primary/40 mx-auto mb-2" />
            <p className="font-display text-lg font-bold text-primary">
              El escandallo está vacío
            </p>
            <p className="text-xs text-neutral mt-1">
              Selecciona materias primas en el buscador superior o carga una plantilla de obrador.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-primary/15">
            {recipeItems.map((item, index) => {
              const percentage =
                totalRawWeight > 0
                  ? ((item.amountGrams / totalRawWeight) * 100).toFixed(1)
                  : "0";
              return (
                <div
                  key={`${item.ingredientId}-${index}`}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral">
                        {String(index + 1).padStart(2, "0")}.
                      </span>
                      <span className="font-bold text-sm text-primary truncate">
                        {item.ingredient.name}
                      </span>
                      {item.ingredient.allergens.length > 0 && (
                        <Badge variant="alert" className="text-[9px] px-1.5 py-0">
                          {item.ingredient.allergens.join(", ")}
                        </Badge>
                      )}
                    </div>
                    <div className="font-mono text-[11px] text-neutral mt-0.5 pl-6">
                      <span>Proporción: {percentage}%</span>
                      <span className="mx-2">·</span>
                      <span>{item.ingredient.source}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        aria-label={`Cantidad en gramos de ${item.ingredient.name}`}
                        value={item.amountGrams}
                        onChange={(e) =>
                          onUpdateAmount(index, parseFloat(e.target.value) || 0)
                        }
                        className="w-24 py-1.5 pl-2 pr-7 bg-white border-2 border-primary/40 focus:border-primary font-mono text-sm font-bold text-primary text-right focus:outline-none"
                      />
                      <span className="absolute right-2.5 top-2 font-mono text-xs text-neutral">
                        g
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      aria-label={`Eliminar ${item.ingredient.name}`}
                      className="p-2 text-neutral hover:text-accent hover:bg-accent/10 border border-transparent hover:border-accent/30 transition-colors cursor-pointer"
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

      {/* Paso 3: Parámetros Físico-Térmicos (Merma y Raciones) */}
      <div className="bg-surface border-2 border-primary p-6 shadow-tactile-sm">
        <div className="flex items-baseline justify-between border-b-2 border-primary/15 pb-4 mb-5">
          <div>
            <span className="font-mono text-xs font-bold text-accent uppercase tracking-widest">
              FASE 03 // PROCESO TÉRMICO Y ENVASADO
            </span>
            <h3 className="font-display text-2xl font-bold text-primary mt-1">
              Factor de Evaporación (Merma) y Porcionado
            </h3>
          </div>
          <Sliders className="w-5 h-5 text-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Evaporación de Humedad */}
          <div className="bg-white p-4 border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="merma-slider"
                className="font-mono text-xs font-bold uppercase text-primary"
              >
                Pérdida de humedad en cocción:
              </label>
              <span className="font-mono text-base font-extrabold text-accent bg-accent/10 px-2 py-0.5 border border-accent/30">
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
              className="w-full accent-[#D94E28] cursor-pointer h-2 bg-[#EAE5D9]"
            />

            <div className="flex justify-between font-mono text-[10px] text-neutral mt-2">
              <span>0% Crudo</span>
              <span>12% Galleta</span>
              <span>20% Confitura</span>
              <span>45% Deshidratado</span>
            </div>
            <p className="text-[11px] text-neutral mt-2 leading-snug">
              Al evaporarse agua durante el horneado, el peso final disminuye y los nutrientes se concentran por cada 100 g.
            </p>
          </div>

          {/* Raciones por envase */}
          <div className="bg-white p-4 border border-primary/20 flex flex-col justify-between">
            <div>
              <label
                htmlFor="servings-input"
                className="block font-mono text-xs font-bold uppercase text-primary mb-2"
              >
                Unidades o raciones por envase comercial:
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="servings-input"
                  type="number"
                  min="1"
                  max="500"
                  value={servingsCount}
                  onChange={(e) =>
                    onUpdateServings(Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                  className="w-28 h-11 px-3 bg-[#F6F3EC] border-2 border-primary font-mono text-base font-bold text-primary focus:outline-none"
                />
                <div className="font-mono text-xs text-neutral">
                  <span className="block text-primary font-bold">
                    {totalRawWeight > 0
                      ? `${((totalRawWeight * (1 - evaporationPercent / 100)) / servingsCount).toFixed(1)} g / ración`
                      : "0 g / ración"}
                  </span>
                  <span>Declarado en columna 2</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-neutral mt-3 leading-snug">
              Calcula automáticamente el porcentaje de Ingesta de Referencia (% IR) sobre una dieta de 8 400 kJ / 2 000 kcal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
