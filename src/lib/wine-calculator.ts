/**
 * Motor de Cálculo Energético y Nutricional para Vinos, Vermuts y Bebidas Alcohólicas
 * Conforme al Reglamento (UE) 2021/2117 y factores de conversión del Anexo XIV del Reglamento (UE) 1169/2011:
 * - Alcohol etílico: density = 0.7894 g/ml -> 29 kJ/g (7 kcal/g)
 * - Hidratos de carbono / Azúcares residuales: 17 kJ/g (4 kcal/g)
 * - Ácidos orgánicos (Acidez total expresada en ácido tartárico): 13 kJ/g (3 kcal/g)
 * - Polialcoholes (Glicerol medio ~7 g/L en vinos secos): 10 kJ/g (2,4 kcal/g)
 */

export interface WineInput {
  wineName: string;
  vintageYear: string;
  appellation: string; // D.O.Ca Rioja, Ribera del Duero, Cava, etc.
  wineType: "tinto" | "blanco" | "rosado" | "espumoso" | "vermut";
  abvPercent: number;        // % vol (ej. 13.5)
  residualSugarGPerL: number;// g/L (ej. 2.5)
  totalAcidityGPerL: number; // g/L en ácido tartárico (ej. 5.2)
  glycerolGPerL: number;     // g/L (por defecto 7.0 g/L)
  containsSulfites: boolean;
  containsEggAlbumin: boolean;
  containsMilkCasein: boolean;
  isOrganic: boolean;
  isVegan: boolean;
}

export interface WineCalculationResult {
  per100ml: {
    energyKj: number;
    energyKcal: number;
    fat: number;
    saturatedFat: number;
    carbs: number;
    sugars: number;
    protein: number;
    salt: number;
    alcoholGrams: number;
    organicAcidsGrams: number;
  };
  bottleSymbolText: string; // Obligatorio en etiqueta física: "E = 334 kJ / 80 kcal (100 ml)"
  ingredientsListEs: string;
  ingredientsListEn: string;
  allergensEs: string[];
  eLabelUrl: string;
  localELabelPath: string;
}

export function calculateWineNutrition(input: WineInput): WineCalculationResult {
  // 1. Alcohol en gramos por 100 ml = % vol * 0.7894
  const alcoholGrams = Math.max(0, input.abvPercent * 0.7894);

  // 2. Azúcares, acidez y polialcoholes pasados de g/L a g/100ml (dividir por 10)
  const sugarsPer100ml = Math.max(0, input.residualSugarGPerL / 10);
  const glycerolPer100ml = Math.max(0, input.glycerolGPerL / 10);
  const carbsPer100ml = sugarsPer100ml + glycerolPer100ml;
  const acidsPer100ml = Math.max(0, input.totalAcidityGPerL / 10);

  // 3. Energía según coeficientes oficiales Anexo XIV Reglamento (UE) 1169/2011
  const energyKjRaw =
    alcoholGrams * 29 +
    sugarsPer100ml * 17 +
    glycerolPer100ml * 10 +
    acidsPer100ml * 13;

  const energyKcalRaw =
    alcoholGrams * 7 +
    sugarsPer100ml * 4 +
    glycerolPer100ml * 2.4 +
    acidsPer100ml * 3;

  const energyKj = Math.round(energyKjRaw);
  const energyKcal = Math.round(energyKcalRaw);

  const allergensEs: string[] = [];
  if (input.containsSulfites) allergensEs.push("Sulfitos (Dióxido de azufre)");
  if (input.containsEggAlbumin) allergensEs.push("Huevo (albúmina de clarificación)");
  if (input.containsMilkCasein) allergensEs.push("Leche (caseína de clarificación)");

  const carbsRounded = Math.round(carbsPer100ml * 10) / 10;
  const sugarsRounded = Math.round(sugarsPer100ml * 10) / 10;

  const params = new URLSearchParams({
    name: input.wineName,
    year: input.vintageYear,
    do: input.appellation,
    abv: String(input.abvPercent),
    kj: String(energyKj),
    kcal: String(energyKcal),
    carbs: String(carbsRounded),
    sugars: String(sugarsRounded),
    sulfites: input.containsSulfites ? "1" : "0",
    egg: input.containsEggAlbumin ? "1" : "0",
    milk: input.containsMilkCasein ? "1" : "0",
    org: input.isOrganic ? "1" : "0",
  });

  const localELabelPath = `/elabel?${params.toString()}`;
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "https://nutrilabel-eu.vercel.app";
  const eLabelUrl = `${origin}${localELabelPath}`;

  const sulfitesEs = input.containsSulfites
    ? ", conservador y antioxidante: **DIÓXIDO DE AZUFRE (SULFITOS) (E-220)**"
    : "";
  const finingEs = [
    input.containsEggAlbumin ? "agentes de clarificación (**ALBÚMINA DE HUEVO**)" : "",
    input.containsMilkCasein ? "agentes de clarificación (**CASEÍNA LÁCTEA**)" : "",
  ]
    .filter(Boolean)
    .join(", ");

  const ingredientsListEs = `Uvas${input.isOrganic ? " ecológicas certificadas" : ""}${
    input.residualSugarGPerL > 4 ? ", mosto de uva concentrado rectificado" : ""
  }, correctores de la acidez (ácido tartárico)${sulfitesEs}${
    finingEs ? `, ${finingEs}` : ""
  }. Envasado en atmósfera protectora.`;

  const ingredientsListEn = `Grapes${input.isOrganic ? " (certified organic)" : ""}${
    input.residualSugarGPerL > 4 ? ", rectified concentrated grape must" : ""
  }, acidity regulators (tartaric acid)${
    input.containsSulfites ? ", preservative: **SULPHUR DIOXIDE (SULPHITES) (E-220)**" : ""
  }. Bottled in a protective atmosphere.`;

  return {
    per100ml: {
      energyKj,
      energyKcal,
      fat: 0,
      saturatedFat: 0,
      carbs: carbsRounded,
      sugars: sugarsRounded,
      protein: 0,
      salt: 0,
      alcoholGrams: Math.round(alcoholGrams * 10) / 10,
      organicAcidsGrams: Math.round(acidsPer100ml * 10) / 10,
    },
    bottleSymbolText: `E = ${energyKj} kJ / ${energyKcal} kcal (100 ml)`,
    ingredientsListEs,
    ingredientsListEn,
    allergensEs,
    eLabelUrl,
    localELabelPath,
  };
}
