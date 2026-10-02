import { MODEL_PRICES, lowestPtaPrice, priceSourceById, type ModelPriceData } from "./model-prices";

/** Budget bands for the "best phones under X" pages. Each page lists phones whose lowest verified PTA-approved new price falls in the band. */
export const BUDGETS = [
  { slug: "under-30000", max: 30000, min: 0, label: "Rs 30,000", short: "30k" },
  { slug: "under-50000", max: 50000, min: 30000, label: "Rs 50,000", short: "50k" },
  { slug: "under-100000", max: 100000, min: 50000, label: "Rs 100,000", short: "100k" },
] as const;

export type Budget = (typeof BUDGETS)[number];

export function getBudget(slug: string) {
  return BUDGETS.find((b) => b.slug === slug);
}

export type BudgetPick = {
  data: ModelPriceData;
  price: number;
  storage: string;
  kind: "official" | "ptaRetail";
  sourceLabel: string;
  sourceHref: string;
  sourceDate: string;
  highlights: { label: string; value: string }[];
  fullSpecs: boolean;
};

/**
 * Phones in a budget band, most expensive first (the most phone the budget buys), using only
 * verified, dated PTA-approved prices from MODEL_PRICES. Non-PTA prices are never used.
 */
export function budgetPicks(budget: Budget): BudgetPick[] {
  const picks: BudgetPick[] = [];
  for (const data of MODEL_PRICES) {
    const low = lowestPtaPrice(data);
    if (!low || low.pkr > budget.max || low.pkr <= budget.min) continue;
    const src = priceSourceById(data, low.source);
    if (!src) continue;
    const fullSpecs = !data.specs.some((s) => s.label === "Versions on sale in Pakistan");
    picks.push({
      data,
      price: low.pkr,
      storage: low.storage,
      kind: low.kind,
      sourceLabel: src.label,
      sourceHref: src.href,
      sourceDate: src.date,
      highlights: data.specs.filter((s) => ["Display", "Processor", "Battery", "Cameras", "Rear cameras", "Versions on sale in Pakistan"].includes(s.label)).slice(0, 4),
      fullSpecs,
    });
  }
  return picks.sort((a, b) => b.price - a.price);
}

/** Latest date among the sources used on a budget page. */
export function budgetCheckedDate(picks: BudgetPick[]) {
  return picks.map((p) => p.sourceDate).sort().at(-1) || null;
}
