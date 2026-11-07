import {
  CalculationResult,
  RecipeItem,
  MANDATORY_EU_ALLERGENS,
  AllergenKey,
  AllergenInfo,
} from '../types/nutrition';

// Ingestas de Referencia (IR) para un adulto medio según Anexo XIII del Reglamento (UE) Nº 1169/2011
export const EU_REFERENCE_INTAKES = {
  energyKj: 8400,
  energyKcal: 2000,
  fat: 70, // g
  saturatedFat: 20, // g
  carbs: 260, // g
  sugars: 90, // g
  protein: 50, // g
  salt: 6, // g
};

/**
 * Reglas oficiales de redondeo de la Guía de la Comisión Europea
 */
export function roundNutrientValue(value: number, type: 'energy' | 'macro' | 'saturated' | 'salt'): number {
  if (value <= 0) return 0;

  if (type === 'energy') {
    return Math.round(value);
  }

  if (type === 'macro') {
    // Grasas, Hidratos, Azúcares, Proteínas, Fibra
    if (value >= 10) {
      return Math.round(value * 10) / 10;
    }
    return Math.round(value * 10) / 10;
  }

  if (type === 'saturated') {
    if (value >= 10) {
      return Math.round(value * 10) / 10;
    }
    return Math.round(value * 10) / 10;
  }

  if (type === 'salt') {
    if (value >= 1) {
      return Math.round(value * 10) / 10;
    }
    return Math.round(value * 100) / 100;
  }

  return Math.round(value * 10) / 10;
}

/**
 * Formatea el valor con decimales o texto normativo para visualización
 */
export function formatNutrientDisplay(value: number, type: 'energy' | 'macro' | 'saturated' | 'salt'): string {
  if (type === 'energy') {
    return `${Math.round(value)}`;
  }
  if (type === 'salt') {
    if (value < 0.01) return '< 0,01 g';
    return `${value.toFixed(2).replace('.', ',')} g`;
  }
  if (type === 'saturated') {
    if (value < 0.1) return '< 0,1 g';
    return `${value.toFixed(1).replace('.', ',')} g`;
  }
  // Macros
  if (value < 0.5) return '< 0,5 g';
  return `${value.toFixed(1).replace('.', ',')} g`;
}

export interface CalculateOptions {
  finishedWeightGrams?: number; // Peso tras horneado/cocción
  evaporationPercent?: number; // Porcentaje de pérdida de agua
  servingsCount?: number;
  servingSizeGrams?: number;
}

/**
 * Motor central de cálculo nutricional según Art. 31.4 Reglamento (UE) Nº 1169/2011
 */
export function calculateRecipeNutrition(
  items: RecipeItem[],
  options: CalculateOptions = {}
): CalculationResult {
  if (items.length === 0) {
    throw new Error('La receta debe contener al menos un ingrediente');
  }

  // 1. Peso crudo total
  const rawWeightGrams = items.reduce((sum, item) => sum + item.amountGrams, 0);

  if (rawWeightGrams <= 0) {
    throw new Error('El peso de los ingredientes debe ser mayor que cero');
  }

  // 2. Determinar peso final (teniendo en cuenta merma/evaporación de agua)
  let finishedWeightGrams = rawWeightGrams;
  let evaporationFactor = 0;

  if (options.finishedWeightGrams && options.finishedWeightGrams > 0) {
    finishedWeightGrams = options.finishedWeightGrams;
    evaporationFactor = Math.max(0, (rawWeightGrams - finishedWeightGrams) / rawWeightGrams);
  } else if (options.evaporationPercent && options.evaporationPercent > 0) {
    evaporationFactor = Math.min(0.9, options.evaporationPercent / 100);
    finishedWeightGrams = rawWeightGrams * (1 - evaporationFactor);
  }

  // 3. Sumar nutrientes absolutos de toda la receta
  const totalNutrients = items.reduce(
    (acc, item) => {
      const factor = item.amountGrams / 100;
      const n = item.ingredient.nutrients;
      return {
        energyKj: acc.energyKj + n.energyKj * factor,
        energyKcal: acc.energyKcal + n.energyKcal * factor,
        fat: acc.fat + n.fat * factor,
        saturatedFat: acc.saturatedFat + n.saturatedFat * factor,
        carbs: acc.carbs + n.carbs * factor,
        sugars: acc.sugars + n.sugars * factor,
        fiber: acc.fiber + n.fiber * factor,
        protein: acc.protein + n.protein * factor,
        salt: acc.salt + n.salt * factor,
      };
    },
    {
      energyKj: 0,
      energyKcal: 0,
      fat: 0,
      saturatedFat: 0,
      carbs: 0,
      sugars: 0,
      fiber: 0,
      protein: 0,
      salt: 0,
    }
  );

  // 4. Calcular concentración por cada 100g de producto TERMINADO
  const per100gMultiplier = 100 / finishedWeightGrams;

  const per100gRaw = {
    energyKj: totalNutrients.energyKj * per100gMultiplier,
    energyKcal: totalNutrients.energyKcal * per100gMultiplier,
    fat: totalNutrients.fat * per100gMultiplier,
    saturatedFat: totalNutrients.saturatedFat * per100gMultiplier,
    carbs: totalNutrients.carbs * per100gMultiplier,
    sugars: totalNutrients.sugars * per100gMultiplier,
    fiber: totalNutrients.fiber * per100gMultiplier,
    protein: totalNutrients.protein * per100gMultiplier,
    salt: totalNutrients.salt * per100gMultiplier,
  };

  const per100g = {
    energyKj: roundNutrientValue(per100gRaw.energyKj, 'energy'),
    energyKcal: roundNutrientValue(per100gRaw.energyKcal, 'energy'),
    fat: roundNutrientValue(per100gRaw.fat, 'macro'),
    saturatedFat: roundNutrientValue(per100gRaw.saturatedFat, 'saturated'),
    carbs: roundNutrientValue(per100gRaw.carbs, 'macro'),
    sugars: roundNutrientValue(per100gRaw.sugars, 'macro'),
    fiber: roundNutrientValue(per100gRaw.fiber, 'macro'),
    protein: roundNutrientValue(per100gRaw.protein, 'macro'),
    salt: roundNutrientValue(per100gRaw.salt, 'salt'),
  };

  // 5. Cálculo por porción/ración
  const servingsCount = options.servingsCount && options.servingsCount > 0 ? options.servingsCount : 1;
  const servingSizeGrams =
    options.servingSizeGrams && options.servingSizeGrams > 0
      ? options.servingSizeGrams
      : finishedWeightGrams / servingsCount;

  const servingMultiplier = servingSizeGrams / 100;

  const perServing = {
    energyKj: roundNutrientValue(per100g.energyKj * servingMultiplier, 'energy'),
    energyKcal: roundNutrientValue(per100g.energyKcal * servingMultiplier, 'energy'),
    fat: roundNutrientValue(per100g.fat * servingMultiplier, 'macro'),
    saturatedFat: roundNutrientValue(per100g.saturatedFat * servingMultiplier, 'saturated'),
    carbs: roundNutrientValue(per100g.carbs * servingMultiplier, 'macro'),
    sugars: roundNutrientValue(per100g.sugars * servingMultiplier, 'macro'),
    fiber: roundNutrientValue(per100g.fiber * servingMultiplier, 'macro'),
    protein: roundNutrientValue(per100g.protein * servingMultiplier, 'macro'),
    salt: roundNutrientValue(per100g.salt * servingMultiplier, 'salt'),
  };

  // 6. Porcentajes de Ingesta de Referencia (% IR)
  const referenceIntakePercent = {
    energy: Math.round((per100g.energyKcal / EU_REFERENCE_INTAKES.energyKcal) * 100),
    fat: Math.round((per100g.fat / EU_REFERENCE_INTAKES.fat) * 100),
    saturatedFat: Math.round((per100g.saturatedFat / EU_REFERENCE_INTAKES.saturatedFat) * 100),
    carbs: Math.round((per100g.carbs / EU_REFERENCE_INTAKES.carbs) * 100),
    sugars: Math.round((per100g.sugars / EU_REFERENCE_INTAKES.sugars) * 100),
    protein: Math.round((per100g.protein / EU_REFERENCE_INTAKES.protein) * 100),
    salt: Math.round((per100g.salt / EU_REFERENCE_INTAKES.salt) * 100),
  };

  // 7. Detección agregada de los 14 alérgenos obligatorios
  const allergensSet = new Set<AllergenKey>();
  items.forEach((item) => {
    item.ingredient.allergens.forEach((allergen) => allergensSet.add(allergen));
  });

  const allergens: AllergenInfo[] = Array.from(allergensSet).map(
    (key) => MANDATORY_EU_ALLERGENS[key]
  );

  // 8. Lista de ingredientes legal ordenada por peso descendente (Art. 18)
  const sortedItems = [...items].sort((a, b) => b.amountGrams - a.amountGrams);
  const ingredientsListFormatted = sortedItems
    .map((item) => {
      const percentage = ((item.amountGrams / rawWeightGrams) * 100).toFixed(1);
      const isAllergenic = item.ingredient.allergens.length > 0;
      // Por normativa, los alérgenos deben destacarse tipográficamente (ej. en MAYÚSCULAS o negrita)
      if (isAllergenic) {
        return `**${item.ingredient.name.toUpperCase()}** (${percentage}%)`;
      }
      return `${item.ingredient.name} (${percentage}%)`;
    })
    .join(', ');

  const ingredientsListFormattedEn = sortedItems
    .map((item) => {
      const percentage = ((item.amountGrams / rawWeightGrams) * 100).toFixed(1);
      const isAllergenic = item.ingredient.allergens.length > 0;
      const enName = item.ingredient.nameEn || item.ingredient.name;
      if (isAllergenic) {
        return `**${enName.toUpperCase()}** (${percentage}%)`;
      }
      return `${enName} (${percentage}%)`;
    })
    .join(', ');

  // 9. Ficha de justificación para inspección sanitaria
  const technicalAuditSheet = {
    calculationMethod:
      'Cálculo ponderado por suma de ingredientes conforme al Artículo 31.4, letra c) del Reglamento (UE) Nº 1169/2011',
    legalReference:
      'Reglamento (UE) Nº 1169/2011 del Parlamento Europeo y del Consejo sobre información alimentaria al consumidor',
    generatedAt: new Date().toISOString(),
    itemsBreakdown: sortedItems.map((item) => ({
      name: item.ingredient.name,
      source: item.ingredient.source,
      amountGrams: item.amountGrams,
      percentageOfRecipe: Number(((item.amountGrams / rawWeightGrams) * 100).toFixed(2)),
      allergens: item.ingredient.allergens.map((k) => MANDATORY_EU_ALLERGENS[k].nameEs),
    })),
  };

  return {
    rawWeightGrams,
    finishedWeightGrams,
    evaporationFactor,
    servingsCount,
    servingSizeGrams: Math.round(servingSizeGrams * 10) / 10,
    per100g,
    perServing,
    referenceIntakePercent,
    allergens,
    ingredientsListFormatted,
    ingredientsListFormattedEn,
    technicalAuditSheet,
  };
}
