import { brandSlug, hasPhoneBrandPage, modelsForBrand } from "./catalog";
import { MODEL_PRICES, lowestPtaPrice } from "./model-prices";
import type { PriceRef } from "./post-ad";
import { slugify } from "./validation";

/**
 * Compact "brand|model" → lowest verified new PTA price + price page, for the Sell form price hint.
 * Built on the server and passed as a prop, so the large price dataset is not shipped to the browser.
 */
export function priceRefsForSellForm(): Record<string, PriceRef> {
  const out: Record<string, PriceRef> = {};
  for (const data of MODEL_PRICES) {
    const best = lowestPtaPrice(data);
    if (!best) continue;
    out[`${data.brand}|${data.model}`.toLowerCase()] = {
      newFrom: best.pkr,
      path:
        data.guidePath ||
        (hasPhoneBrandPage(data.brand) && modelsForBrand(data.brand).includes(data.model) ? `/phones/${brandSlug(data.brand)}/${slugify(data.model)}` : ""),
    };
  }
  return out;
}
