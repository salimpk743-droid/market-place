import raw from "../catalog-data.json" with { type: "json" };

export type City = {
  slug: string;
  name: string;
  province: string;
  popular?: boolean;
  areas: string[];
};

export type Brand = { slug: string; name: string };
export type PtaOption = { id: string; label: string; short: string; cls: string };
export type Category = {
  slug: string;
  name: string;
  short: string;
  noun: string;
  needsPta: boolean;
  needsStorage: boolean;
  blurb: string;
};

export const CITY_COUNT = raw.CITY_COUNT as number;
export const PROVINCES = raw.PROVINCES as { id: string; name: string }[];
export const CITIES = raw.CITIES as City[];
export const BRANDS = raw.BRANDS as Brand[];
export const ACCESSORY_BRANDS = raw.ACCESSORY_BRANDS as Brand[];
export const MODELS_BY_BRAND = raw.MODELS_BY_BRAND as Record<string, string[]>;
export const ACCESSORY_MODELS = raw.ACCESSORY_MODELS as Record<string, string[]>;
export const CATEGORIES = raw.CATEGORIES as Category[];
export const PTA = raw.PTA as PtaOption[];
export const STORAGE_OPTIONS = raw.STORAGE_OPTIONS as number[];
export const RAM_OPTIONS = raw.RAM_OPTIONS as number[];
export const CONDITIONS = raw.CONDITIONS as string[];

const ALL_BRAND_MAP = new Map<string, Brand>();
for (const b of [...BRANDS, ...ACCESSORY_BRANDS]) ALL_BRAND_MAP.set(b.name.toLowerCase(), b);
export const ALL_BRANDS = Array.from(ALL_BRAND_MAP.values());

export const PHONE_CATEGORY = "phone";
export const ACCESSORY_SLUGS = CATEGORIES.filter((c) => c.slug !== PHONE_CATEGORY).map((c) => c.slug);

/** Older working slugs → canonical slugs from the final category model. */
export const CATEGORY_ALIASES: Record<string, string> = {
  phones: "phone",
  "used-phones": "phone",
  "power-banks": "power-bank",
  powerbank: "power-bank",
  chargers: "charger-cable",
  charger: "charger-cable",
  cables: "charger-cable",
  covers: "cover-case",
  cases: "cover-case",
  cover: "cover-case",
  "screen-protectors": "screen-protector",
  smartwatches: "smartwatch-band",
  smartwatch: "smartwatch-band",
  bands: "smartwatch-band",
  other: "other-accessory",
  accessories: "other-accessory",
};

export function canonicalCategory(slug: string | null | undefined) {
  if (!slug) return PHONE_CATEGORY;
  return CATEGORY_ALIASES[slug] || slug;
}

export function categoryFilterValues(canonical: string) {
  const slug = canonicalCategory(canonical);
  const aliases = Object.entries(CATEGORY_ALIASES)
    .filter(([, value]) => value === slug)
    .map(([key]) => key);
  return Array.from(new Set([slug, ...aliases]));
}

const cityBySlug = new Map(CITIES.map((c) => [c.slug, c]));
const brandBySlug = new Map(ALL_BRANDS.map((b) => [b.slug, b]));
const brandByName = new Map(ALL_BRANDS.map((b) => [b.name.toLowerCase(), b]));
const ptaById = new Map(PTA.map((p) => [p.id, p]));
const categoryBySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));

export function getCity(slug: string) {
  return cityBySlug.get(slug);
}

export function cityName(slug: string) {
  return cityBySlug.get(slug)?.name || slug;
}

export function cityLabel(slug: string, area?: string | null) {
  const name = cityName(slug);
  return area ? `${name}, ${area}` : name;
}

export function popularCities() {
  return CITIES.filter((c) => c.popular);
}

export function getPhoneBrandBySlug(slug: string) {
  return BRANDS.find((b) => b.slug === slug.toLowerCase());
}

export function getBrandBySlug(slug: string) {
  return brandBySlug.get(slug.toLowerCase());
}

export function getBrandByName(name: string) {
  return brandByName.get(name.toLowerCase());
}

export function brandSlug(name: string) {
  return getBrandByName(name)?.slug || name.toLowerCase().replace(/\s+/g, "-");
}

export function ptaMeta(id: string | null | undefined) {
  if (!id || id === "n/a") return null;
  return ptaById.get(id) || null;
}

export function modelsForBrand(name: string) {
  return MODELS_BY_BRAND[name] || [];
}

export function getCategory(slug: string | null | undefined) {
  const canonical = canonicalCategory(slug);
  return categoryBySlug.get(canonical) || categoryBySlug.get(PHONE_CATEGORY)!;
}

export function isPhoneCategory(slug: string | null | undefined) {
  return canonicalCategory(slug) === PHONE_CATEGORY;
}

export function categoryPath(slug: string | null | undefined) {
  const cat = getCategory(slug);
  return cat.slug === PHONE_CATEGORY ? "/phones" : `/accessories/${cat.slug}`;
}

export function brandsForCategory(slug: string | null | undefined) {
  return isPhoneCategory(slug) ? BRANDS : ALL_BRANDS;
}

export function modelsForCategory(slug: string | null | undefined, brand?: string) {
  if (isPhoneCategory(slug)) return modelsForBrand(brand || "");
  return ACCESSORY_MODELS[getCategory(slug).slug] || [];
}

export function inferCategory(q: string) {
  const t = q.toLowerCase();
  if (/\b(cover|case|pouch)\b/.test(t)) return "covers";
  if (/power\s*bank|powerbank/.test(t)) return "power-banks";
  if (/\b(charger|cable|adapter|gan|magsafe charger)\b/.test(t)) return "chargers";
  if (/airpods?|earbud|earphone|tws/.test(t)) return "earbuds";
  if (/headphone|headset/.test(t)) return "headphones";
  if (/screen\s*protect|tempered glass|hydrogel/.test(t)) return "screen-protectors";
  if (/smart\s*watch|apple watch|galaxy watch|\bband\b/.test(t)) return "smartwatches";
  if (/\b(car mount|selfie|memory card|otg|speaker|pop socket)\b/.test(t)) return "other";
  return undefined;
}
