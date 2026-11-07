// Tipos para el sistema de cálculo nutricional según Reglamento (UE) Nº 1169/2011

export type AllergenKey =
  | 'gluten'
  | 'crustaceos'
  | 'huevos'
  | 'pescado'
  | 'cacahuetes'
  | 'soja'
  | 'lacteos'
  | 'frutos_de_cascara'
  | 'apio'
  | 'mostaza'
  | 'sesamo'
  | 'dioxido_azufre_sulfitos'
  | 'altramuces'
  | 'moluscos';

export interface AllergenInfo {
  key: AllergenKey;
  nameEs: string;
  nameEn: string;
}

export const MANDATORY_EU_ALLERGENS: Record<AllergenKey, AllergenInfo> = {
  gluten: { key: 'gluten', nameEs: 'Cereales con gluten', nameEn: 'Cereals containing gluten' },
  crustaceos: { key: 'crustaceos', nameEs: 'Crustáceos', nameEn: 'Crustaceans' },
  huevos: { key: 'huevos', nameEs: 'Huevos', nameEn: 'Eggs' },
  pescado: { key: 'pescado', nameEs: 'Pescado', nameEn: 'Fish' },
  cacahuetes: { key: 'cacahuetes', nameEs: 'Cacahuetes', nameEn: 'Peanuts' },
  soja: { key: 'soja', nameEs: 'Soja', nameEn: 'Soybeans' },
  lacteos: { key: 'lacteos', nameEs: 'Leche y derivados (incluida lactosa)', nameEn: 'Milk and dairy products' },
  frutos_de_cascara: { key: 'frutos_de_cascara', nameEs: 'Frutos de cáscara (almendras, nueces, etc.)', nameEn: 'Tree nuts' },
  apio: { key: 'apio', nameEs: 'Apio', nameEn: 'Celery' },
  mostaza: { key: 'mostaza', nameEs: 'Mostaza', nameEn: 'Mustard' },
  sesamo: { key: 'sesamo', nameEs: 'Granos de sésamo', nameEn: 'Sesame seeds' },
  dioxido_azufre_sulfitos: { key: 'dioxido_azufre_sulfitos', nameEs: 'Dióxido de azufre y sulfitos (>10 mg/kg)', nameEn: 'Sulphur dioxide and sulphites' },
  altramuces: { key: 'altramuces', nameEs: 'Altramuces', nameEn: 'Lupin' },
  moluscos: { key: 'moluscos', nameEs: 'Moluscos', nameEn: 'Molluscs' },
};

export interface IngredientNutrients {
  energyKj: number;
  energyKcal: number;
  fat: number;
  saturatedFat: number;
  carbs: number;
  sugars: number;
  fiber: number;
  protein: number;
  salt: number; // en gramos (sodio * 2.5)
}

export interface Ingredient {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  source: string; // ej. "BEDCA ID #412" o "USDA FoodData #169761"
  sourceUrl?: string;
  nutrients: IngredientNutrients;
  allergens: AllergenKey[];
}

export interface RecipeItem {
  ingredientId: string;
  ingredient: Ingredient;
  amountGrams: number;
}

export interface CalculationResult {
  rawWeightGrams: number;
  finishedWeightGrams: number;
  evaporationFactor: number; // Merma / pérdida de agua
  servingsCount: number;
  servingSizeGrams: number;
  
  // Por 100g
  per100g: {
    energyKj: number;
    energyKcal: number;
    fat: number;
    saturatedFat: number;
    carbs: number;
    sugars: number;
    fiber: number;
    protein: number;
    salt: number;
  };

  // Por porción/ración
  perServing: {
    energyKj: number;
    energyKcal: number;
    fat: number;
    saturatedFat: number;
    carbs: number;
    sugars: number;
    fiber: number;
    protein: number;
    salt: number;
  };

  // Porcentajes de Ingesta de Referencia (%IR) para un adulto (8400 kJ / 2000 kcal)
  referenceIntakePercent: {
    energy: number;
    fat: number;
    saturatedFat: number;
    carbs: number;
    sugars: number;
    protein: number;
    salt: number;
  };

  // Alérgenos presentes con nombres oficiales
  allergens: AllergenInfo[];

  // Lista ordenada de ingredientes por peso descendente (obligatorio por ley)
  ingredientsListFormatted: string;
  ingredientsListFormattedEn?: string;

  // Justificación técnica para auditoría
  technicalAuditSheet: {
    calculationMethod: string;
    legalReference: string;
    generatedAt: string;
    itemsBreakdown: {
      name: string;
      source: string;
      amountGrams: number;
      percentageOfRecipe: number;
      allergens: string[];
    }[];
  };
}
