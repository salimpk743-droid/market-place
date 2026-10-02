/**
 * Verified Pakistan price and spec data for model pages.
 *
 * Rules: every number below comes from a dated source listed in `sources`.
 * Leave a cell `undefined` when no reliable figure exists; never estimate.
 * Update `checked` dates whenever the figures are re-verified.
 */

export type PriceSource = {
  id: string;
  label: string;
  href: string;
  /** Date the figure was published or last checked (ISO yyyy-mm-dd). */
  date: string;
  kind: "official" | "retailer" | "news" | "tax" | "specs";
};

export type PricePoint = { pkr: number; source: string; note?: string };

export type VariantPrice = {
  storage: string;
  /** Official PTA-approved price from the brand's Pakistan website, distributors or authorised resellers. */
  official?: PricePoint[];
  /** PTA-approved retail price at a named online retailer. */
  ptaRetail?: PricePoint[];
  /** Non-PTA retail price at a named online retailer. */
  nonPta?: PricePoint[];
};

export type ModelPriceData = {
  brand: string;
  model: string;
  lastUpdated: string;
  /** Dedicated editorial price page; the model page then shows a short summary linking to it. */
  guidePath?: string;
  summary: string;
  variants: VariantPrice[];
  ptaTax?: { passport: number; cnic: number; source: string };
  specs: { label: string; value: string }[];
  specSource: string;
  notes: string[];
  sources: PriceSource[];
};

import { ANDROID_MODEL_PRICES } from "./model-prices-android";

const CHECKED = "2026-10-02";

const S = {
  mercantile17: {
    id: "mercantile17",
    label: "Mercantile (Apple distributor), iPhone 17 series suggested retail prices, PTA approved, Apple official warranty",
    href: "https://mercantile.com.pk/price/iphone-17",
    date: CHECKED,
    kind: "official",
  },
  mercantile17e: {
    id: "mercantile17e",
    label: "PkRevenue: Mercantile launches iPhone 17e in Pakistan (10 Apr 2026)",
    href: "https://pkrevenue.com/mercantile-launches-iphone-17e-in-pakistan-with-rs-289000-price/",
    date: "2026-04-10",
    kind: "news",
  },
  iselect18: {
    id: "iselect18",
    label: "PhoneWorld: iPhone 18 Pro series launches in Pakistan, iSelect by Airlink and GNext prices (25 Sep 2026)",
    href: "https://www.phoneworld.com.pk/iphone-18-pro-series-launches-in-pakistan-with-prices-starting-at-rs-563999/",
    date: "2026-09-25",
    kind: "news",
  },
  mercantile18: {
    id: "mercantile18",
    label: "Minute Mirror: iPhone 18 Pro prices announced in Pakistan, Mercantile price list (25 Sep 2026)",
    href: "https://minutemirror.com.pk/iphone-18-pro-prices-announced-in-pakistan-635340/",
    date: "2026-09-25",
    kind: "news",
  },
  mega: {
    id: "mega",
    label: "Mega.pk Apple mobile listings (separate PTA-approved and NON-PTA product pages)",
    href: "https://www.mega.pk/mobiles-apple/",
    date: CHECKED,
    kind: "retailer",
  },
  pw17tax: {
    id: "pw17tax",
    label: "PhoneWorld: iPhone 17 PTA tax, all models (updated 8 Jul 2026)",
    href: "https://www.phoneworld.com.pk/apple-iphone-17-17-air-17-pro-17-pro-max-pta-tax/",
    date: "2026-07-08",
    kind: "tax",
  },
  apple17: {
    id: "apple17",
    label: "Apple Newsroom: Apple debuts iPhone 17 (9 Sep 2025)",
    href: "https://www.apple.com/newsroom/2025/09/apple-debuts-iphone-17/",
    date: "2025-09-09",
    kind: "specs",
  },
  appleAir: {
    id: "appleAir",
    label: "Apple Newsroom: Introducing iPhone Air (9 Sep 2025)",
    href: "https://www.apple.com/newsroom/2025/09/introducing-iphone-air-a-powerful-new-iphone-with-a-breakthrough-design/",
    date: "2025-09-09",
    kind: "specs",
  },
  apple17Pro: {
    id: "apple17Pro",
    label: "Apple Newsroom: Apple unveils iPhone 17 Pro and iPhone 17 Pro Max (9 Sep 2025)",
    href: "https://www.apple.com/newsroom/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/",
    date: "2025-09-09",
    kind: "specs",
  },
  apple17e: {
    id: "apple17e",
    label: "Apple Newsroom: Apple introduces iPhone 17e (2 Mar 2026)",
    href: "https://www.apple.com/newsroom/2026/03/apple-introduces-iphone-17e/",
    date: "2026-03-02",
    kind: "specs",
  },
  apple18Pro: {
    id: "apple18Pro",
    label: "Apple Newsroom: Apple debuts iPhone 18 Pro and iPhone 18 Pro Max (9 Sep 2026)",
    href: "https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/",
    date: "2026-09-09",
    kind: "specs",
  },
  apple18ProSpecs: {
    id: "apple18ProSpecs",
    label: "Apple: iPhone 18 Pro and iPhone 18 Pro Max technical specifications",
    href: "https://www.apple.com/iphone-18-pro/specs/",
    date: CHECKED,
    kind: "specs",
  },
} satisfies Record<string, PriceSource>;

const p = (pkr: number, source: keyof typeof S, note?: string): PricePoint => ({ pkr, source, ...(note ? { note } : {}) });

const PTA_TAX_NOTE =
  "Published PTA tax figures are estimates at the exchange rate of the publication date; the PSID amount shown on DIRBS on the day you pay is final.";

export const MODEL_PRICES: ModelPriceData[] = [
  {
    brand: "Apple",
    model: "iPhone 17",
    lastUpdated: CHECKED,
    summary:
      "The official PTA-approved iPhone 17 is Rs 399,000 (256GB) and Rs 482,500 (512GB) at Mercantile's suggested retail price. We found no non-PTA iPhone 17 on sale at a retailer that labels its units clearly, so that column is empty.",
    variants: [
      { storage: "256GB", official: [p(399000, "mercantile17")], ptaRetail: [p(369999, "mega")] },
      { storage: "512GB", official: [p(482500, "mercantile17")] },
    ],
    ptaTax: { passport: 149640, cnic: 164604, source: "pw17tax" },
    specs: [
      { label: "Display", value: "6.3-inch display with ProMotion" },
      { label: "Chip", value: "A19" },
      { label: "Rear camera", value: "48MP Dual Fusion camera system" },
      { label: "Front camera", value: "Center Stage front camera" },
      { label: "Storage", value: "256GB, 512GB" },
      { label: "Colours", value: "Black, lavender, mist blue, sage, white" },
      { label: "SIM (Pakistan official units)", value: "Physical SIM + eSIM (Mercantile)" },
      { label: "US launch price", value: "From $799" },
      { label: "Released", value: "Pre-orders 12 Sep 2025, available 19 Sep 2025" },
    ],
    specSource: "apple17",
    notes: [PTA_TAX_NOTE],
    sources: [S.mercantile17, S.mega, S.pw17tax, S.apple17],
  },
  {
    brand: "Apple",
    model: "iPhone Air",
    lastUpdated: CHECKED,
    summary:
      "The official PTA-approved iPhone Air is Rs 428,500 (256GB), Rs 508,500 (512GB) and Rs 588,500 (1TB) at Mercantile's suggested retail price. iPhone Air is eSIM-only.",
    variants: [
      { storage: "256GB", official: [p(428500, "mercantile17")], ptaRetail: [p(424999, "mega")], nonPta: [p(289999, "mega", "Listed with \"PTA Approved: No\"")] },
      { storage: "512GB", official: [p(508500, "mercantile17")], ptaRetail: [p(504999, "mega")] },
      { storage: "1TB", official: [p(588500, "mercantile17")], ptaRetail: [p(584999, "mega")] },
    ],
    ptaTax: { passport: 156322, cnic: 172377, source: "pw17tax" },
    specs: [
      { label: "Display", value: "6.5-inch Super Retina XDR with ProMotion up to 120Hz" },
      { label: "Chip", value: "A19 Pro, N1 and C1X" },
      { label: "Rear camera", value: "48MP Fusion Main" },
      { label: "Front camera", value: "18MP Center Stage" },
      { label: "Storage", value: "256GB, 512GB, 1TB" },
      { label: "SIM", value: "eSIM only" },
      { label: "Colours", value: "Space black, cloud white, light gold, sky blue" },
      { label: "US launch price", value: "From $999" },
      { label: "Released", value: "Pre-orders 12 Sep 2025, available 19 Sep 2025" },
    ],
    specSource: "appleAir",
    notes: [PTA_TAX_NOTE, "PhoneWorld lists this model as \"iPhone 17 Air\"; Apple's name is iPhone Air."],
    sources: [S.mercantile17, S.mega, S.pw17tax, S.appleAir],
  },
  {
    brand: "Apple",
    model: "iPhone 17 Pro",
    lastUpdated: CHECKED,
    summary:
      "The official PTA-approved iPhone 17 Pro is Rs 491,100 (256GB), Rs 574,100 (512GB) and Rs 657,100 (1TB) at Mercantile's suggested retail price. Non-PTA units are listed from Rs 381,999 (256GB) at Mega.pk.",
    variants: [
      { storage: "256GB", official: [p(491100, "mercantile17")], ptaRetail: [p(462999, "mega")], nonPta: [p(381999, "mega")] },
      { storage: "512GB", official: [p(574100, "mercantile17")], ptaRetail: [p(560999, "mega")], nonPta: [p(424999, "mega")] },
      { storage: "1TB", official: [p(657100, "mercantile17")], ptaRetail: [p(653999, "mega")] },
    ],
    ptaTax: { passport: 190679, cnic: 209747, source: "pw17tax" },
    specs: [
      { label: "Display", value: "6.3-inch Super Retina XDR, Ceramic Shield 2" },
      { label: "Chip", value: "A19 Pro" },
      { label: "Rear cameras", value: "Three 48MP Fusion cameras: Main, Ultra Wide, Telephoto" },
      { label: "Storage", value: "256GB, 512GB, 1TB" },
      { label: "Colours", value: "Cosmic orange, deep blue, silver" },
      { label: "SIM (Pakistan official units)", value: "Physical SIM + eSIM (Mercantile)" },
      { label: "US launch price", value: "From $1,099" },
      { label: "Released", value: "Pre-orders 12 Sep 2025, available 19 Sep 2025" },
    ],
    specSource: "apple17Pro",
    notes: [PTA_TAX_NOTE],
    sources: [S.mercantile17, S.mega, S.pw17tax, S.apple17Pro],
  },
  {
    brand: "Apple",
    model: "iPhone 17 Pro Max",
    lastUpdated: CHECKED,
    summary:
      "The official PTA-approved iPhone 17 Pro Max is Rs 535,600 (256GB) to Rs 869,100 (2TB) at Mercantile's suggested retail price. Non-PTA units are listed from Rs 411,999 (256GB) at Mega.pk.",
    variants: [
      { storage: "256GB", official: [p(535600, "mercantile17")], ptaRetail: [p(494999, "mega")], nonPta: [p(411999, "mega")] },
      { storage: "512GB", official: [p(619100, "mercantile17")], ptaRetail: [p(581999, "mega")], nonPta: [p(471999, "mega")] },
      { storage: "1TB", official: [p(702600, "mercantile17")], ptaRetail: [p(684999, "mega")], nonPta: [p(544999, "mega")] },
      { storage: "2TB", official: [p(869100, "mercantile17")] },
    ],
    ptaTax: { passport: 204954, cnic: 225449, source: "pw17tax" },
    specs: [
      { label: "Display", value: "6.9-inch Super Retina XDR, Ceramic Shield 2" },
      { label: "Chip", value: "A19 Pro" },
      { label: "Rear cameras", value: "Three 48MP Fusion cameras: Main, Ultra Wide, Telephoto" },
      { label: "Storage", value: "256GB, 512GB, 1TB, 2TB" },
      { label: "Colours", value: "Cosmic orange, deep blue, silver" },
      { label: "SIM (Pakistan official units)", value: "Physical SIM + eSIM (Mercantile)" },
      { label: "US launch price", value: "From $1,199" },
      { label: "Released", value: "Pre-orders 12 Sep 2025, available 19 Sep 2025" },
    ],
    specSource: "apple17Pro",
    notes: [PTA_TAX_NOTE],
    sources: [S.mercantile17, S.mega, S.pw17tax, S.apple17Pro],
  },
  {
    brand: "Apple",
    model: "iPhone 17e",
    lastUpdated: CHECKED,
    summary:
      "Mercantile launched the official PTA-approved iPhone 17e at Rs 289,000 (256GB) and Rs 377,500 (512GB), as reported on 10 Apr 2026. We found no verified non-PTA retail price or published PTA tax figure.",
    variants: [
      { storage: "256GB", official: [p(289000, "mercantile17e")] },
      { storage: "512GB", official: [p(377500, "mercantile17e")] },
    ],
    specs: [
      { label: "Display", value: "6.1-inch Super Retina XDR, Ceramic Shield 2" },
      { label: "Chip", value: "A19, C1X modem" },
      { label: "Rear camera", value: "48MP Fusion (optical-quality 2x)" },
      { label: "Storage", value: "256GB, 512GB" },
      { label: "Colours", value: "Black, white, soft pink" },
      { label: "Charging", value: "MagSafe" },
      { label: "US launch price", value: "From $599" },
      { label: "Released", value: "Announced 2 Mar 2026, available 11 Mar 2026" },
    ],
    specSource: "apple17e",
    notes: ["The Pakistan launch price is from a news report of Mercantile's announcement; Mercantile's current price page did not list iPhone 17e when we checked."],
    sources: [S.mercantile17e, S.apple17e],
  },
  {
    brand: "Apple",
    model: "iPhone 18 Pro",
    lastUpdated: CHECKED,
    guidePath: "/iphone-18-pro-price-in-pakistan",
    summary:
      "The official PTA-approved iPhone 18 Pro starts at Rs 563,999 (256GB) at iSelect by Airlink and GNext, and Rs 565,000 on Mercantile's launch price list. The 2TB model is about Rs 1.07 million. We found no verified non-PTA retail price yet.",
    variants: [
      { storage: "256GB", official: [p(563999, "iselect18", "iSelect / GNext"), p(565000, "mercantile18", "Mercantile")] },
      { storage: "512GB", official: [p(647999, "iselect18", "iSelect / GNext"), p(649999, "mercantile18", "Mercantile")] },
      { storage: "1TB", official: [p(818999, "iselect18", "iSelect / GNext"), p(819999, "mercantile18", "Mercantile")] },
      { storage: "2TB", official: [p(1073999, "iselect18", "iSelect / GNext"), p(1075000, "mercantile18", "Mercantile")] },
    ],
    specs: [
      { label: "Display", value: "6.3-inch Super Retina XDR OLED, 2622 × 1206, 460 ppi" },
      { label: "Chip", value: "A20 Pro, N1 (Wi-Fi 7), C2 modem" },
      { label: "Main camera", value: "48MP Fusion Main with variable aperture (up to ƒ/1.48)" },
      { label: "Other cameras", value: "48MP Fusion Ultra Wide, 48MP Fusion Telephoto (4x), 18MP Center Stage front" },
      { label: "Storage", value: "256GB, 512GB, 1TB, 2TB" },
      { label: "Weight", value: "211 g" },
      { label: "Battery (Apple)", value: "Up to 36 hours video playback (eSIM-only model)" },
      { label: "Colours", value: "Burgundy, glacier, silver, black" },
      { label: "US launch price", value: "From $1,199" },
      { label: "Released", value: "Pre-orders 12 Sep 2026, available 18 Sep 2026" },
    ],
    specSource: "apple18ProSpecs",
    notes: [
      "No reliable iPhone 18 Pro PTA tax figure has been published yet; check DIRBS for the PSID amount.",
      "Apple's US model is eSIM-only. Ask the seller whether an imported unit is eSIM-only or has a physical SIM tray.",
    ],
    sources: [S.iselect18, S.mercantile18, S.apple18Pro, S.apple18ProSpecs],
  },
  {
    brand: "Apple",
    model: "iPhone 18 Pro Max",
    lastUpdated: CHECKED,
    guidePath: "/iphone-18-pro-max-price-in-pakistan",
    summary:
      "The official PTA-approved iPhone 18 Pro Max starts at Rs 603,999 (256GB) at iSelect by Airlink and GNext, and Rs 605,000 on Mercantile's launch price list. Non-PTA 256GB units are listed at Mega.pk from Rs 514,999 (dual eSIM).",
    variants: [
      {
        storage: "256GB",
        official: [p(603999, "iselect18", "iSelect / GNext"), p(605000, "mercantile18", "Mercantile")],
        ptaRetail: [p(619999, "mega")],
        nonPta: [p(514999, "mega", "Dual eSIM"), p(559999, "mega", "Physical SIM + eSIM")],
      },
      { storage: "512GB", official: [p(688999, "iselect18", "iSelect / GNext"), p(690000, "mercantile18", "Mercantile")], ptaRetail: [p(704999, "mega")] },
      { storage: "1TB", official: [p(858999, "iselect18", "iSelect / GNext"), p(860000, "mercantile18", "Mercantile")], ptaRetail: [p(879999, "mega")] },
      { storage: "2TB", official: [p(1113999, "iselect18", "iSelect / GNext"), p(1115000, "mercantile18", "Mercantile")] },
    ],
    specs: [
      { label: "Display", value: "6.9-inch Super Retina XDR OLED, 2868 × 1320, 460 ppi" },
      { label: "Chip", value: "A20 Pro, N1 (Wi-Fi 7)" },
      { label: "Main camera", value: "48MP Fusion Main with variable aperture (up to ƒ/1.48)" },
      { label: "Other cameras", value: "48MP Fusion Ultra Wide, 48MP Fusion Telephoto (4x), 18MP Center Stage front" },
      { label: "Storage", value: "256GB, 512GB, 1TB, 2TB" },
      { label: "Weight", value: "249 g" },
      { label: "Battery (Apple)", value: "Up to 45 hours video playback (eSIM-only model)" },
      { label: "Colours", value: "Burgundy, glacier, silver, black" },
      { label: "US launch price", value: "From $1,299" },
      { label: "Released", value: "Pre-orders 12 Sep 2026, available 18 Sep 2026" },
    ],
    specSource: "apple18ProSpecs",
    notes: [
      "No reliable iPhone 18 Pro Max PTA tax figure has been published yet; check DIRBS for the PSID amount.",
      "Mega.pk lists two non-PTA 256GB versions: dual eSIM and physical SIM + eSIM.",
    ],
    sources: [S.iselect18, S.mercantile18, S.mega, S.apple18Pro, S.apple18ProSpecs],
  },
  ...ANDROID_MODEL_PRICES,
];

const byKey = new Map(MODEL_PRICES.map((m) => [`${m.brand}|${m.model}`.toLowerCase(), m]));

export function getModelPriceData(brand: string, model: string) {
  return byKey.get(`${brand}|${model}`.toLowerCase());
}

export function priceSourceById(data: ModelPriceData, id: string) {
  return data.sources.find((s) => s.id === id);
}

/** Lowest official (PTA-approved) price across all variants, for summaries and schema. */
export function lowestOfficialPrice(data: ModelPriceData) {
  const all = data.variants.flatMap((v) => (v.official || []).map((x) => x.pkr));
  return all.length ? Math.min(...all) : null;
}

/**
 * Lowest verified price for a new, PTA-approved unit (official or PTA-approved retail),
 * used for budget pages. Non-PTA prices are excluded.
 */
export function lowestPtaPrice(data: ModelPriceData) {
  let best: { pkr: number; storage: string; source: string; kind: "official" | "ptaRetail" } | null = null;
  for (const v of data.variants) {
    for (const [kind, points] of [["official", v.official], ["ptaRetail", v.ptaRetail]] as const) {
      for (const pt of points || []) {
        if (!best || pt.pkr < best.pkr) best = { pkr: pt.pkr, storage: v.storage, source: pt.source, kind };
      }
    }
  }
  return best;
}

export function highestOfficialPrice(data: ModelPriceData) {
  const all = data.variants.flatMap((v) => (v.official || []).map((x) => x.pkr));
  return all.length ? Math.max(...all) : null;
}

/** "2 Oct 2026" style date for "last updated" labels (UTC, so server and client agree). */
export function formatCheckedDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
