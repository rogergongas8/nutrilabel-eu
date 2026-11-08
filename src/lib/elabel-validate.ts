import type { WineInput } from "./wine-calculator";

const TYPES = ["tinto", "blanco", "rosado", "espumoso", "vermut"] as const;

const str = (v: unknown, max: number): string | null =>
  typeof v === "string" && v.trim().length > 0 && v.length <= max ? v.trim() : null;

const num = (v: unknown, min: number, max: number): number | null =>
  typeof v === "number" && Number.isFinite(v) && v >= min && v <= max ? v : null;

/** Validates untrusted JSON into a WineInput. Returns an error string on failure. */
export function parseWineInput(raw: unknown): { ok: true; wine: WineInput } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Invalid body" };
  const r = raw as Record<string, unknown>;

  const wineName = str(r.wineName, 120);
  const vintageYear = str(r.vintageYear, 12);
  const appellation = str(r.appellation, 120);
  const abv = num(r.abvPercent, 0.5, 25);
  const sugar = num(r.residualSugarGPerL, 0, 400);
  const acidity = num(r.totalAcidityGPerL, 0, 20);
  const glycerol = num(r.glycerolGPerL, 0, 30);
  const wineType = TYPES.find((t) => t === r.wineType);

  if (!wineName) return { ok: false, error: "wineName" };
  if (!vintageYear) return { ok: false, error: "vintageYear" };
  if (!appellation) return { ok: false, error: "appellation" };
  if (abv === null) return { ok: false, error: "abvPercent" };
  if (sugar === null) return { ok: false, error: "residualSugarGPerL" };
  if (acidity === null) return { ok: false, error: "totalAcidityGPerL" };
  if (glycerol === null) return { ok: false, error: "glycerolGPerL" };
  if (!wineType) return { ok: false, error: "wineType" };

  return {
    ok: true,
    wine: {
      wineName,
      vintageYear,
      appellation,
      wineType,
      abvPercent: abv,
      residualSugarGPerL: sugar,
      totalAcidityGPerL: acidity,
      glycerolGPerL: glycerol,
      containsSulfites: r.containsSulfites === true,
      containsEggAlbumin: r.containsEggAlbumin === true,
      containsMilkCasein: r.containsMilkCasein === true,
      isOrganic: r.isOrganic === true,
      isVegan: r.isVegan === true,
    },
  };
}

export function parseEmail(v: unknown): string | null {
  return typeof v === "string" && v.length <= 200 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? v : null;
}
