/**
 * Verified Pakistan prices for Samsung, Xiaomi/Redmi, Vivo, Oppo, Infinix and Tecno models.
 * Same rules as model-prices.ts: every figure is from a dated source in `sources`;
 * leave cells empty when no reliable figure exists. Retailer prices were read from the
 * retailer's product pages on the `checked` date and change often.
 */
import type { ModelPriceData, PricePoint, PriceSource } from "./model-prices";

const CHECKED = "2026-10-02";

const p = (pkr: number, source: string, note?: string): PricePoint => (note ? { pkr, source, note } : { pkr, source });

function mega(brand: string, slug: string): PriceSource {
  return {
    id: "mega",
    label: `Mega.pk ${brand} mobile listings (PTA-approved and non-PTA units are listed as separate products)`,
    href: `https://www.mega.pk/mobiles-${slug}/`,
    date: CHECKED,
    kind: "retailer",
  };
}

function priceoye(model: string, path: string): PriceSource {
  return {
    id: "priceoye",
    label: `PriceOye: ${model} product page (new units with official brand warranty)`,
    href: `https://priceoye.pk/mobiles/${path}`,
    date: CHECKED,
    kind: "retailer",
  };
}

function vivo(model: string, slug: string): PriceSource {
  return {
    id: "vivoPk",
    label: `vivo Pakistan: ${model} specifications and listed price`,
    href: `https://www.vivo.com/pk/products/param/${slug}`,
    date: CHECKED,
    kind: "official",
  };
}

const MEGA_SAMSUNG = mega("Samsung", "samsung");
const MEGA_XIAOMI = mega("Xiaomi", "xiaomi");
const MEGA_INFINIX = mega("Infinix", "infinix");
const MEGA_OPPO = mega("Oppo", "oppo");

const SAMSUNG_S26: PriceSource = {
  id: "samsungS26",
  label: "Samsung Global Newsroom: Samsung unveils Galaxy S26 series, specification table (25 Feb 2026)",
  href: "https://news.samsung.com/global/samsung-unveils-galaxy-s26-series-the-most-intuitive-galaxy-ai-phone-yet",
  date: "2026-02-25",
  kind: "specs",
};

const SAMSUNG_A57: PriceSource = {
  id: "samsungA57",
  label: "Samsung Global Newsroom: Samsung unveils Galaxy A57 5G and Galaxy A37 5G, specification table (25 Mar 2026)",
  href: "https://news.samsung.com/global/samsung-unveils-galaxy-a57-5g-and-galaxy-a37-5g-packing-pro-level-features-at-awesome-price",
  date: "2026-03-25",
  kind: "specs",
};

const SAMSUNG_A57_UK: PriceSource = {
  id: "samsungA57uk",
  label: "Samsung UK support: differences between Galaxy A57 5G and A37 5G (processor and display type)",
  href: "https://www.samsung.com/uk/support/mobile-devices/what-are-the-differences-between-the-galaxy-a57-5g-and-a37-5g/",
  date: CHECKED,
  kind: "specs",
};

const OPPO_A6PRO: PriceSource = {
  id: "oppoA6Pro",
  label: "OPPO Pakistan: OPPO A6 Pro specifications",
  href: "https://www.oppo.com/pk/smartphones/series-a/a6-pro/specs/",
  date: CHECKED,
  kind: "specs",
};

const RETAIL_NOTE =
  "Retailer prices are what the named shop listed on the date shown; they change often and may include temporary discounts.";

/** Spec row for models where we only verified the versions on sale, not a full spec sheet. */
const versions = (value: string) => ({ label: "Versions on sale in Pakistan", value });

export const ANDROID_MODEL_PRICES: ModelPriceData[] = [
  // ---------------- Samsung ----------------
  {
    brand: "Samsung",
    model: "Galaxy S26 Ultra",
    lastUpdated: CHECKED,
    summary:
      "PTA-approved Galaxy S26 Ultra units are listed at Mega.pk for Rs 447,999 (12GB/256GB) and Rs 517,999 (12GB/512GB). Non-PTA units are listed from Rs 271,999. We could not read a clear official Samsung Pakistan price per version, so that column is empty.",
    variants: [
      { storage: "12GB / 256GB", ptaRetail: [p(447999, "mega")], nonPta: [p(271999, "mega")] },
      { storage: "12GB / 512GB", ptaRetail: [p(517999, "mega")], nonPta: [p(314999, "mega")] },
    ],
    specs: [
      { label: "Display", value: "6.9-inch QHD+ Dynamic AMOLED 2X, 1–120Hz adaptive refresh" },
      { label: "Processor", value: "Snapdragon 8 Elite Gen 5 for Galaxy" },
      { label: "Rear cameras", value: "200MP wide, 50MP ultra-wide, 50MP 5x telephoto, 10MP 3x telephoto" },
      { label: "Front camera", value: "12MP" },
      { label: "Battery", value: "5,000mAh, 60W wired charging" },
      { label: "Memory / storage (global)", value: "12GB + 256GB, 12GB + 512GB, 16GB + 1TB" },
      { label: "Size / weight", value: "163.6 × 78.1 × 7.9mm, 214g" },
      { label: "Software", value: "Android 16, One UI 8.5" },
      { label: "Water resistance", value: "IP68" },
    ],
    specSource: "samsungS26",
    notes: [RETAIL_NOTE, "A non-PTA phone needs PTA tax paid through DIRBS before a Pakistani SIM works long term."],
    sources: [MEGA_SAMSUNG, SAMSUNG_S26],
  },
  {
    brand: "Samsung",
    model: "Galaxy S26 Plus",
    lastUpdated: CHECKED,
    summary:
      "PTA-approved Galaxy S26+ units are listed at Mega.pk for Rs 382,999 (12GB/256GB) and Rs 442,999 (12GB/512GB). No verified non-PTA or official Samsung Pakistan price was available.",
    variants: [
      { storage: "12GB / 256GB", ptaRetail: [p(382999, "mega")] },
      { storage: "12GB / 512GB", ptaRetail: [p(442999, "mega")] },
    ],
    specs: [
      { label: "Display", value: "6.7-inch QHD+ Dynamic AMOLED 2X, 1–120Hz adaptive refresh" },
      { label: "Rear cameras", value: "50MP wide, 12MP ultra-wide, 10MP 3x telephoto" },
      { label: "Front camera", value: "12MP" },
      { label: "Battery", value: "4,900mAh" },
      { label: "Memory / storage", value: "12GB + 256GB, 12GB + 512GB" },
      { label: "Size / weight", value: "158.4 × 75.8 × 7.3mm, 190g" },
      { label: "Software", value: "Android 16, One UI 8.5" },
    ],
    specSource: "samsungS26",
    notes: [RETAIL_NOTE, "Samsung's own name for this model is Galaxy S26+."],
    sources: [MEGA_SAMSUNG, SAMSUNG_S26],
  },
  {
    brand: "Samsung",
    model: "Galaxy S26",
    lastUpdated: CHECKED,
    summary:
      "PTA-approved Galaxy S26 units are listed at Mega.pk for Rs 317,999 (12GB/256GB) and Rs 378,999 (12GB/512GB).",
    variants: [
      { storage: "12GB / 256GB", ptaRetail: [p(317999, "mega")] },
      { storage: "12GB / 512GB", ptaRetail: [p(378999, "mega")] },
    ],
    specs: [
      { label: "Display", value: "6.3-inch FHD+ Dynamic AMOLED 2X, 1–120Hz adaptive refresh" },
      { label: "Rear cameras", value: "50MP wide, 12MP ultra-wide, 10MP 3x telephoto" },
      { label: "Front camera", value: "12MP" },
      { label: "Battery", value: "4,300mAh" },
      { label: "Memory / storage", value: "12GB + 256GB, 12GB + 512GB" },
      { label: "Size / weight", value: "149.6 × 71.7 × 7.2mm, 167g" },
      { label: "Software", value: "Android 16, One UI 8.5" },
    ],
    specSource: "samsungS26",
    notes: [RETAIL_NOTE],
    sources: [MEGA_SAMSUNG, SAMSUNG_S26],
  },
  {
    brand: "Samsung",
    model: "Galaxy A57",
    lastUpdated: CHECKED,
    summary:
      "PTA-approved Galaxy A57 5G units are listed at Mega.pk from Rs 165,999 (8GB/256GB) to Rs 223,999 (12GB/512GB).",
    variants: [
      { storage: "8GB / 256GB", ptaRetail: [p(165999, "mega")] },
      { storage: "12GB / 256GB", ptaRetail: [p(183999, "mega")] },
      { storage: "12GB / 512GB", ptaRetail: [p(223999, "mega")] },
    ],
    specs: [
      { label: "Display", value: "6.7-inch FHD+ Super AMOLED+, 120Hz" },
      { label: "Processor", value: "Exynos 1680 (4nm)" },
      { label: "Rear cameras", value: "50MP wide, 12MP ultra-wide, 5MP macro" },
      { label: "Front camera", value: "12MP" },
      { label: "Battery", value: "5,000mAh (typical)" },
      { label: "Size / weight", value: "161.5 × 76.8 × 6.9mm, 179g" },
      { label: "Software", value: "Android 16, One UI 8.5" },
      { label: "Water resistance", value: "IP68" },
    ],
    specSource: "samsungA57",
    notes: [RETAIL_NOTE, "Processor and display type are from Samsung UK's comparison page."],
    sources: [MEGA_SAMSUNG, SAMSUNG_A57, SAMSUNG_A57_UK],
  },
  {
    brand: "Samsung",
    model: "Galaxy A37",
    lastUpdated: CHECKED,
    summary: "The PTA-approved Galaxy A37 5G (8GB/256GB) is listed at Mega.pk for Rs 147,999.",
    variants: [{ storage: "8GB / 256GB", ptaRetail: [p(147999, "mega")] }],
    specs: [
      { label: "Display", value: "6.7-inch FHD+ Super AMOLED, 120Hz" },
      { label: "Processor", value: "Exynos 1480 (4nm)" },
      { label: "Rear cameras", value: "50MP wide, 8MP ultra-wide, 5MP macro" },
      { label: "Front camera", value: "12MP" },
      { label: "Battery", value: "5,000mAh (typical)" },
      { label: "Size / weight", value: "162.9 × 78.2 × 7.4mm, 196g" },
      { label: "Software", value: "Android 16, One UI 8.5" },
      { label: "Water resistance", value: "IP68" },
    ],
    specSource: "samsungA57",
    notes: [RETAIL_NOTE, "Processor and display type are from Samsung UK's comparison page."],
    sources: [MEGA_SAMSUNG, SAMSUNG_A57, SAMSUNG_A57_UK],
  },
  {
    brand: "Samsung",
    model: "Galaxy A17",
    lastUpdated: CHECKED,
    summary:
      "PTA-approved Galaxy A17 units are listed at Mega.pk for Rs 71,999 (6GB/128GB), Rs 93,999 (8GB/256GB) and Rs 98,999 (8GB/256GB 5G).",
    variants: [
      { storage: "6GB / 128GB", ptaRetail: [p(71999, "mega")] },
      { storage: "8GB / 256GB", ptaRetail: [p(93999, "mega")] },
      { storage: "8GB / 256GB (5G)", ptaRetail: [p(98999, "mega")] },
    ],
    specs: [versions("6GB/128GB, 8GB/256GB, 8GB/256GB 5G (Mega.pk listings)")],
    specSource: "mega",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [MEGA_SAMSUNG],
  },
  {
    brand: "Samsung",
    model: "Galaxy A07",
    lastUpdated: CHECKED,
    summary:
      "PTA-approved Galaxy A07 units are listed at Mega.pk for Rs 41,999 (4GB/64GB), Rs 51,999 (4GB/128GB) and Rs 61,999 (6GB/128GB).",
    variants: [
      { storage: "4GB / 64GB", ptaRetail: [p(41999, "mega")] },
      { storage: "4GB / 128GB", ptaRetail: [p(51999, "mega")] },
      { storage: "6GB / 128GB", ptaRetail: [p(61999, "mega")] },
    ],
    specs: [versions("4GB/64GB, 4GB/128GB, 6GB/128GB (Mega.pk listings)")],
    specSource: "mega",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [MEGA_SAMSUNG],
  },
  {
    brand: "Samsung",
    model: "Galaxy A06",
    lastUpdated: CHECKED,
    summary: "The Galaxy A06 (4GB/64GB) is listed at PriceOye for Rs 22,499, down from a listed Rs 27,999. Higher versions are also listed there.",
    variants: [{ storage: "4GB / 64GB", ptaRetail: [p(22499, "priceoye", "List price Rs 27,999")] }],
    specs: [versions("4GB/64GB, 4GB/128GB, 6GB/128GB (PriceOye listing)")],
    specSource: "priceoye",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [priceoye("Samsung Galaxy A06", "samsung/samsung-galaxy-a06")],
  },

  // ---------------- Xiaomi / Redmi ----------------
  {
    brand: "Xiaomi",
    model: "Redmi Note 15 Pro",
    lastUpdated: CHECKED,
    summary: "PTA-approved Redmi Note 15 Pro units are listed at Mega.pk for Rs 94,999 (8GB/256GB) and Rs 115,999 (12GB/512GB).",
    variants: [
      { storage: "8GB / 256GB", ptaRetail: [p(94999, "mega")] },
      { storage: "12GB / 512GB", ptaRetail: [p(115999, "mega")] },
    ],
    specs: [versions("8GB/256GB, 12GB/512GB (Mega.pk listings)")],
    specSource: "mega",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [MEGA_XIAOMI],
  },
  {
    brand: "Xiaomi",
    model: "Redmi Note 15",
    lastUpdated: CHECKED,
    summary: "The PTA-approved Redmi Note 15 (8GB/128GB) is listed at Mega.pk for Rs 65,999.",
    variants: [{ storage: "8GB / 128GB", ptaRetail: [p(65999, "mega")] }],
    specs: [versions("8GB/128GB (Mega.pk listing)")],
    specSource: "mega",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [MEGA_XIAOMI],
  },
  {
    brand: "Xiaomi",
    model: "Redmi 15",
    lastUpdated: CHECKED,
    summary: "The PTA-approved Redmi 15 (8GB/128GB) is listed at Mega.pk for Rs 56,499.",
    variants: [{ storage: "8GB / 128GB", ptaRetail: [p(56499, "mega")] }],
    specs: [versions("8GB/128GB (Mega.pk listing)")],
    specSource: "mega",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [MEGA_XIAOMI],
  },
  {
    brand: "Xiaomi",
    model: "Redmi 15C",
    lastUpdated: CHECKED,
    summary: "The PTA-approved Redmi 15C (6GB/128GB) is listed at Mega.pk for Rs 51,499.",
    variants: [{ storage: "6GB / 128GB", ptaRetail: [p(51499, "mega")] }],
    specs: [versions("6GB/128GB (Mega.pk listing)")],
    specSource: "mega",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [MEGA_XIAOMI],
  },
  {
    brand: "Xiaomi",
    model: "Redmi A5",
    lastUpdated: CHECKED,
    summary: "The PTA-approved Redmi A5 (4GB/128GB) is listed at Mega.pk for Rs 38,999.",
    variants: [{ storage: "4GB / 128GB", ptaRetail: [p(38999, "mega")] }],
    specs: [versions("4GB/128GB (Mega.pk listing)")],
    specSource: "mega",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [MEGA_XIAOMI],
  },
  {
    brand: "Xiaomi",
    model: "Redmi 14C",
    lastUpdated: CHECKED,
    summary: "The Redmi 14C (4GB/128GB) is listed at PriceOye for Rs 29,999. A 6GB/128GB version is also listed there.",
    variants: [{ storage: "4GB / 128GB", ptaRetail: [p(29999, "priceoye")] }],
    specs: [versions("4GB/128GB, 6GB/128GB (PriceOye listing)")],
    specSource: "priceoye",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [priceoye("Xiaomi Redmi 14C", "xiaomi/xiaomi-redmi-14c")],
  },

  // ---------------- Vivo (official vivo Pakistan prices) ----------------
  {
    brand: "Vivo",
    model: "X300 FE",
    lastUpdated: CHECKED,
    summary: "vivo Pakistan lists the X300 FE (12GB/256GB) at Rs 279,999.",
    variants: [{ storage: "12GB / 256GB", official: [p(279999, "vivoPk")] }],
    specs: [
      { label: "Display", value: "6.31-inch, 2640 × 1216, 1–120Hz" },
      { label: "Processor", value: "Snapdragon 8 Gen 5 (3nm)" },
      { label: "Cameras", value: "Rear 50MP + 8MP + 50MP; front 50MP" },
      { label: "Battery", value: "6,500mAh (typical), 90W wired, 40W wireless" },
      { label: "Memory / storage", value: "12GB + 256GB, LPDDR5X Ultra, UFS 4.1" },
      { label: "Weight", value: "191g" },
      { label: "Software", value: "OriginOS 6, Android 16" },
      { label: "Water resistance", value: "IP68 & IP69" },
    ],
    specSource: "vivoPk",
    notes: ["Official prices are what vivo Pakistan lists on its website on the date shown."],
    sources: [vivo("X300 FE", "x300-fe")],
  },
  {
    brand: "Vivo",
    model: "V70",
    lastUpdated: CHECKED,
    summary: "vivo Pakistan lists the V70 at Rs 179,999 (8GB/256GB), Rs 199,999 (12GB/256GB) and Rs 229,999 (12GB/512GB).",
    variants: [
      { storage: "8GB / 256GB", official: [p(179999, "vivoPk")] },
      { storage: "12GB / 256GB", official: [p(199999, "vivoPk")] },
      { storage: "12GB / 512GB", official: [p(229999, "vivoPk")] },
    ],
    specs: [
      { label: "Display", value: "6.59-inch, 2750 × 1260, up to 120Hz" },
      { label: "Processor", value: "Snapdragon 7 Gen 4 (4nm)" },
      { label: "Cameras", value: "Rear 50MP ZEISS main with OIS; front 50MP" },
      { label: "Battery", value: "6,500mAh (typical), 90W" },
      { label: "Weight", value: "187g (Black)" },
      { label: "Software", value: "OriginOS 6, Android 16" },
      { label: "Water resistance", value: "IP68 & IP69" },
    ],
    specSource: "vivoPk",
    notes: ["Official prices are what vivo Pakistan lists on its website on the date shown."],
    sources: [vivo("V70", "v70")],
  },
  {
    brand: "Vivo",
    model: "Y500",
    lastUpdated: CHECKED,
    summary: "vivo Pakistan lists the Y500 at Rs 87,999 (6GB/128GB), Rs 99,999 (8GB/128GB) and Rs 109,999 (8GB/256GB).",
    variants: [
      { storage: "6GB / 128GB", official: [p(87999, "vivoPk")] },
      { storage: "8GB / 128GB", official: [p(99999, "vivoPk")] },
      { storage: "8GB / 256GB", official: [p(109999, "vivoPk")] },
    ],
    specs: [
      { label: "Display", value: "6.83-inch, 2800 × 1260, 120Hz" },
      { label: "Cameras", value: "Rear 50MP + 2MP; front 32MP" },
      { label: "Battery", value: "8,100mAh (typical), 44W" },
      { label: "Weight", value: "210g" },
      { label: "Software", value: "OriginOS 6, Android 16" },
      { label: "Water resistance", value: "IP68/IP69" },
    ],
    specSource: "vivoPk",
    notes: ["Official prices are what vivo Pakistan lists on its website on the date shown."],
    sources: [vivo("Y500", "y500")],
  },
  {
    brand: "Vivo",
    model: "Y31d",
    lastUpdated: CHECKED,
    summary: "vivo Pakistan lists the Y31d at Rs 72,999 (6GB/128GB), Rs 82,999 (8GB/128GB) and Rs 94,999 (8GB/256GB).",
    variants: [
      { storage: "6GB / 128GB", official: [p(72999, "vivoPk")] },
      { storage: "8GB / 128GB", official: [p(82999, "vivoPk")] },
      { storage: "8GB / 256GB", official: [p(94999, "vivoPk")] },
    ],
    specs: [
      { label: "Display", value: "6.75-inch, 1570 × 720, up to 120Hz" },
      { label: "Processor", value: "Snapdragon 6s Gen 2 4G (6nm)" },
      { label: "Cameras", value: "Rear 50MP + 2MP; front 8MP" },
      { label: "Battery", value: "7,200mAh (typical), 44W" },
      { label: "Weight", value: "219g" },
      { label: "Software", value: "OriginOS 6, Android 16" },
      { label: "Water resistance", value: "IP68 and IP69" },
    ],
    specSource: "vivoPk",
    notes: ["Official prices are what vivo Pakistan lists on its website on the date shown."],
    sources: [vivo("Y31d", "y31d")],
  },
  {
    brand: "Vivo",
    model: "Y11d",
    lastUpdated: CHECKED,
    summary: "vivo Pakistan lists the Y11d at Rs 52,999 (4GB/128GB) and Rs 68,999 (6GB/128GB).",
    variants: [
      { storage: "4GB / 128GB", official: [p(52999, "vivoPk")] },
      { storage: "6GB / 128GB", official: [p(68999, "vivoPk")] },
    ],
    specs: [
      { label: "Display", value: "6.74-inch, 1600 × 720, up to 120Hz" },
      { label: "Processor", value: "T7225 (12nm)" },
      { label: "Cameras", value: "Rear 50MP + 0.08MP; front 5MP" },
      { label: "Battery", value: "6,500mAh (typical), 44W" },
      { label: "Weight", value: "209g" },
      { label: "Water resistance", value: "IP65" },
    ],
    specSource: "vivoPk",
    notes: ["Official prices are what vivo Pakistan lists on its website on the date shown."],
    sources: [vivo("Y11d", "y11d")],
  },
  {
    brand: "Vivo",
    model: "Y05e",
    lastUpdated: CHECKED,
    summary: "vivo Pakistan lists the Y05e (4GB/64GB) at Rs 39,999.",
    variants: [{ storage: "4GB / 64GB", official: [p(39999, "vivoPk")] }],
    specs: [
      { label: "Display", value: "6.74-inch, 1600 × 720, 60/90Hz" },
      { label: "Processor", value: "T7225 (12nm)" },
      { label: "Cameras", value: "Rear 8MP; front 5MP" },
      { label: "Battery", value: "5,150mAh (typical), 15W" },
      { label: "Weight", value: "199g" },
      { label: "Software", value: "OriginOS 6, Android 16" },
      { label: "Water resistance", value: "IP64" },
    ],
    specSource: "vivoPk",
    notes: ["Official prices are what vivo Pakistan lists on its website on the date shown."],
    sources: [vivo("Y05e", "y05e")],
  },

  // ---------------- Oppo ----------------
  {
    brand: "Oppo",
    model: "Find X9 Pro",
    lastUpdated: CHECKED,
    summary: "The PTA-approved Oppo Find X9 Pro (16GB/512GB) is listed at Mega.pk for Rs 354,999; it was shown as out of stock on the date checked.",
    variants: [{ storage: "16GB / 512GB", ptaRetail: [p(354999, "mega", "Out of stock when checked")] }],
    specs: [versions("16GB/512GB (Mega.pk listing)")],
    specSource: "mega",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [MEGA_OPPO],
  },
  {
    brand: "Oppo",
    model: "A6 Pro",
    lastUpdated: CHECKED,
    summary: "The PTA-approved Oppo A6 Pro (8GB/256GB) is listed at Mega.pk for Rs 94,999.",
    variants: [{ storage: "8GB / 256GB", ptaRetail: [p(94999, "mega")] }],
    specs: [
      { label: "Display", value: "6.57-inch FHD+ (1080 × 2372), up to 120Hz" },
      { label: "Processor", value: "MediaTek Helio G100" },
      { label: "Battery", value: "7,000mAh (typical), up to 80W SUPERVOOC" },
      { label: "Memory / storage", value: "8GB + 128GB, 8GB + 256GB" },
      { label: "Weight", value: "About 188g" },
      { label: "Software", value: "ColorOS 15.0" },
    ],
    specSource: "oppoA6Pro",
    notes: [RETAIL_NOTE],
    sources: [MEGA_OPPO, OPPO_A6PRO],
  },

  // ---------------- Infinix ----------------
  {
    brand: "Infinix",
    model: "Note 60 Pro",
    lastUpdated: CHECKED,
    summary: "The PTA-approved Infinix Note 60 Pro (8GB/256GB) is listed at Mega.pk for Rs 121,999.",
    variants: [{ storage: "8GB / 256GB", ptaRetail: [p(121999, "mega")] }],
    specs: [versions("8GB/256GB (Mega.pk listing)")],
    specSource: "mega",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [MEGA_INFINIX],
  },
  {
    brand: "Infinix",
    model: "Note 60",
    lastUpdated: CHECKED,
    summary: "The PTA-approved Infinix Note 60 (8GB/256GB) is listed at Mega.pk for Rs 104,999.",
    variants: [{ storage: "8GB / 256GB", ptaRetail: [p(104999, "mega")] }],
    specs: [versions("8GB/256GB (Mega.pk listing)")],
    specSource: "mega",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [MEGA_INFINIX],
  },
  {
    brand: "Infinix",
    model: "Hot 60 Pro",
    lastUpdated: CHECKED,
    summary: "The PTA-approved Infinix Hot 60 Pro (8GB/128GB) is listed at Mega.pk for Rs 73,999.",
    variants: [{ storage: "8GB / 128GB", ptaRetail: [p(73999, "mega")] }],
    specs: [versions("8GB/128GB (Mega.pk listing)")],
    specSource: "mega",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [MEGA_INFINIX],
  },
  {
    brand: "Infinix",
    model: "Hot 60i",
    lastUpdated: CHECKED,
    summary: "The PTA-approved Infinix Hot 60i (6GB/128GB) is listed at Mega.pk for Rs 54,999.",
    variants: [{ storage: "6GB / 128GB", ptaRetail: [p(54999, "mega")] }],
    specs: [versions("6GB/128GB (Mega.pk listing)")],
    specSource: "mega",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [MEGA_INFINIX],
  },
  {
    brand: "Infinix",
    model: "Smart 10 Plus",
    lastUpdated: CHECKED,
    summary: "The PTA-approved Infinix Smart 10 Plus (4GB/128GB) is listed at Mega.pk for Rs 46,999.",
    variants: [{ storage: "4GB / 128GB", ptaRetail: [p(46999, "mega")] }],
    specs: [versions("4GB/128GB (Mega.pk listing)")],
    specSource: "mega",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [MEGA_INFINIX],
  },

  // ---------------- Tecno (PriceOye) ----------------
  {
    brand: "Tecno",
    model: "Camon 50 Pro",
    lastUpdated: CHECKED,
    summary: "The Tecno Camon 50 Pro (8GB/256GB) is listed at PriceOye for Rs 99,999, down from a listed Rs 109,999.",
    variants: [{ storage: "8GB / 256GB", ptaRetail: [p(99999, "priceoye", "List price Rs 109,999")] }],
    specs: [versions("8GB/256GB (PriceOye listing)")],
    specSource: "priceoye",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [priceoye("Tecno Camon 50 Pro", "tecno/tecno-camon-50-pro")],
  },
  {
    brand: "Tecno",
    model: "Camon 50",
    lastUpdated: CHECKED,
    summary: "The Tecno Camon 50 (8GB/256GB) is listed at PriceOye for Rs 90,999, down from a listed Rs 99,999.",
    variants: [{ storage: "8GB / 256GB", ptaRetail: [p(90999, "priceoye", "List price Rs 99,999")] }],
    specs: [versions("8GB/256GB (PriceOye listing)")],
    specSource: "priceoye",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [priceoye("Tecno Camon 50", "tecno/tecno-camon-50")],
  },
  {
    brand: "Tecno",
    model: "Spark 50 Pro",
    lastUpdated: CHECKED,
    summary: "The Tecno Spark 50 Pro (8GB/128GB) is listed at PriceOye for Rs 69,499, down from a listed Rs 74,999.",
    variants: [{ storage: "8GB / 128GB", ptaRetail: [p(69499, "priceoye", "List price Rs 74,999")] }],
    specs: [versions("8GB/128GB (PriceOye listing)")],
    specSource: "priceoye",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [priceoye("Tecno Spark 50 Pro", "tecno/tecno-spark-50-pro")],
  },
  {
    brand: "Tecno",
    model: "Spark 50",
    lastUpdated: CHECKED,
    summary: "The Tecno Spark 50 (6GB/128GB) is listed at PriceOye for Rs 62,999, down from a listed Rs 64,999.",
    variants: [{ storage: "6GB / 128GB", ptaRetail: [p(62999, "priceoye", "List price Rs 64,999")] }],
    specs: [versions("6GB/128GB (PriceOye listing)")],
    specSource: "priceoye",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [priceoye("Tecno Spark 50", "tecno/tecno-spark-50")],
  },
  {
    brand: "Tecno",
    model: "Spark 40",
    lastUpdated: CHECKED,
    summary: "The Tecno Spark 40 (6GB/128GB) is listed at PriceOye for Rs 49,999, down from a listed Rs 53,999.",
    variants: [{ storage: "6GB / 128GB", ptaRetail: [p(49999, "priceoye", "List price Rs 53,999")] }],
    specs: [versions("6GB/128GB (PriceOye listing)")],
    specSource: "priceoye",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [priceoye("Tecno Spark 40", "tecno/tecno-spark-40")],
  },
  {
    brand: "Tecno",
    model: "Spark Go 3",
    lastUpdated: CHECKED,
    summary: "The Tecno Spark Go 3 (4GB/64GB) is listed at PriceOye for Rs 39,499, down from a listed Rs 41,999. A 4GB/128GB version is also listed there.",
    variants: [{ storage: "4GB / 64GB", ptaRetail: [p(39499, "priceoye", "List price Rs 41,999")] }],
    specs: [versions("4GB/64GB, 4GB/128GB (PriceOye listing)")],
    specSource: "priceoye",
    notes: [RETAIL_NOTE, "We have not verified a full spec sheet for this model yet."],
    sources: [priceoye("Tecno Spark Go 3", "tecno/tecno-spark-go-3")],
  },
];
