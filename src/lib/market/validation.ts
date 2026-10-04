import {
  ACCESSORY_SLUGS,
  ALL_BRANDS,
  CATEGORIES,
  CITIES,
  CONDITIONS,
  PTA,
  PHONE_CATEGORY,
  RAM_OPTIONS,
  STORAGE_OPTIONS,
  canonicalCategory,
  getCategory,
  isPhoneCategory,
  sellBrandsForCategory,
} from "./catalog";

export const MAX_DESCRIPTION = 4000;
export const MIN_PRICE = 200;
export const MIN_PHONE_PRICE = 1000;
export const MAX_PRICE = 10_000_000;
export const MAX_PHOTOS = 6;
/** Limit for the shrunk photo that is actually uploaded (photos are resized on the phone first). */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const phoneBrandNames = new Set(sellBrandsForCategory(PHONE_CATEGORY).map((b) => b.name));
const allBrandNames = new Set([...ALL_BRANDS, ...sellBrandsForCategory("accessories")].map((b) => b.name));
const citySlugs = new Set(CITIES.map((c) => c.slug));
const ptaIds = new Set(PTA.map((p) => p.id));
const categorySlugs = new Set(CATEGORIES.map((c) => c.slug));

export type FieldErrors = Record<string, string>;

export function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, "");
}

export function sanitizeText(input: unknown, max = 200) {
  const s = stripHtml(String(input ?? "")).replace(/\s+/g, " ").trim();
  return s.slice(0, max);
}

export function normalizePhone(input: string) {
  const digits = String(input || "").replace(/\D/g, "");
  if (digits.startsWith("92") && digits.length === 12) return "0" + digits.slice(2);
  return digits;
}

export function isValidPkMobile(input: string) {
  const d = normalizePhone(input);
  return /^03[0-9]{9}$/.test(d);
}

export function formatPkMobile(input: string) {
  const d = normalizePhone(input);
  if (d.length === 11) return `${d.slice(0, 4)}-${d.slice(4, 7)}${d.slice(7)}`;
  return d;
}

export function whatsappDigits(input: string) {
  const d = normalizePhone(input);
  if (d.startsWith("0") && d.length === 11) return "92" + d.slice(1);
  return d;
}

export function slugify(input: string) {
  return stripHtml(input)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export type ListingInput = {
  category: string;
  brand: string;
  model: string;
  storageGb: number | null;
  ramGb: number | null;
  pricePkr: number;
  citySlug: string;
  /** Optional. Empty string when the seller skipped it. */
  area: string;
  ptaStatus: string | null;
  batteryHealth: number | null;
  condition: string;
  description: string;
  color: string;
  year: number | null;
  sellerName: string;
  contactPhone: string;
};

export function parseListingForm(form: FormData | Record<string, string>): { data?: ListingInput; errors: FieldErrors } {
  const get = (k: string) =>
    form instanceof FormData ? String(form.get(k) || "") : String(form[k] || "");
  const errors: FieldErrors = {};
  const category = canonicalCategory(sanitizeText(get("category") || PHONE_CATEGORY, 40) || PHONE_CATEGORY);
  const brand = sanitizeText(get("brand"), 40);
  const model = sanitizeText(get("model"), 80);
  const citySlug = sanitizeText(get("city"), 80);
  const area = sanitizeText(get("area"), 80);
  const condition = sanitizeText(get("condition"), 40);
  const sellerName = sanitizeText(get("sellerName") || get("seller"), 80);
  const contactPhone = get("contactPhone") || get("phone");
  const description = stripHtml(get("description")).trim().slice(0, MAX_DESCRIPTION);
  const color = sanitizeText(get("color"), 40);
  const pricePkr = Number(get("price"));
  const phone = isPhoneCategory(category);
  const ptaStatus = phone ? sanitizeText(get("pta"), 40) : null;
  const storageGb = phone && get("storage") ? Number(get("storage")) : null;
  const ramGb = phone && get("ram") ? Number(get("ram")) : null;
  const batteryHealth = phone && get("battery") ? Number(get("battery")) : null;
  const year = get("year") ? Number(get("year")) : null;
  const minPrice = phone ? MIN_PHONE_PRICE : MIN_PRICE;

  if (!categorySlugs.has(category)) errors.category = "Please choose what you are selling.";
  if (phone) {
    if (!phoneBrandNames.has(brand)) errors.brand = brand ? "Please choose the brand from the list (or Other)." : "Please choose the phone brand.";
  } else if (!allBrandNames.has(brand)) {
    errors.brand = brand ? "Please choose the brand from the list (or Other)." : "Please choose the brand.";
  }
  if (!model) errors.model = phone ? "Please choose or type the phone model." : "Please type the item name or model.";
  else if (model.length < 2) errors.model = "Model name is too short.";
  if (!citySlugs.has(citySlug)) errors.city = "Please choose your city.";
  const city = CITIES.find((c) => c.slug === citySlug);
  if (city && area && !city.areas.includes(area)) errors.area = "Please choose an area from the list, or leave it empty.";
  if (phone && !ptaIds.has(ptaStatus || "")) errors.pta = "Please choose PTA status.";
  if (!CONDITIONS.includes(condition)) errors.condition = "Please choose the condition.";
  if (!get("price").trim()) errors.price = "Please enter your price in rupees.";
  else if (!Number.isFinite(pricePkr) || pricePkr < minPrice || pricePkr > MAX_PRICE) {
    errors.price = `Price should be between Rs ${minPrice.toLocaleString("en-PK")} and Rs ${MAX_PRICE.toLocaleString("en-PK")}.`;
  }
  if (storageGb != null && !STORAGE_OPTIONS.includes(storageGb)) errors.storage = "Please choose the storage.";
  if (ramGb != null && !RAM_OPTIONS.includes(ramGb)) errors.ram = "Please choose the RAM.";
  if (batteryHealth != null && (batteryHealth < 1 || batteryHealth > 100)) errors.battery = "Battery health should be a number from 1 to 100.";
  if (year != null && (year < 2014 || year > new Date().getFullYear() + 1)) errors.year = "Please enter a correct year, like 2023.";
  if (sellerName.length < 2) errors.sellerName = "Please write your name or shop name (at least 2 letters).";
  if (!isValidPkMobile(contactPhone)) errors.contactPhone = "Please enter a Pakistani mobile number, like 0300-1234567.";
  if (description.length > MAX_DESCRIPTION) errors.description = "Description is too long.";

  if (Object.keys(errors).length) return { errors };

  return {
    errors,
    data: {
      category,
      brand,
      model,
      storageGb,
      ramGb,
      pricePkr,
      citySlug,
      area,
      ptaStatus,
      batteryHealth,
      condition,
      description,
      color,
      year,
      sellerName,
      contactPhone: formatPkMobile(contactPhone),
    },
  };
}

/** Checks the shrunk, ready-to-upload photo (JPEG/PNG/WebP). Raw picks are checked by precheckPhoto in post-ad.ts. */
export function isAllowedImageFile(file: { type: string; size: number; name: string }) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "Use a JPG, PNG or WebP photo.";
  if (file.size > MAX_UPLOAD_BYTES) return "Each photo must be under 5 MB.";
  const name = file.name.toLowerCase();
  if (name.includes("..") || name.includes("/") || name.includes("\\")) return "Invalid file name.";
  if (/\.(svg|html|js|exe|php|sh)$/i.test(name)) return "That file type is not allowed.";
  return null;
}

export function safeImageFilename(original: string) {
  const ext = (original.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const allowed = ext === "jpeg" ? "jpg" : ext;
  const use = ["jpg", "jpeg", "png", "webp"].includes(allowed) ? allowed : "jpg";
  return `${crypto.randomUUID()}.${use === "jpeg" ? "jpg" : use}`;
}

export function isAccessorySlug(slug: string) {
  return ACCESSORY_SLUGS.includes(slug);
}

export function categoryLabel(slug: string) {
  return getCategory(slug).name;
}

/** Fields compared when checking whether a new ad repeats one the seller already has. */
export type DuplicateCandidate = {
  id?: string | number;
  category?: string | null;
  brand?: string | null;
  model?: string | null;
  storage_gb?: number | null;
  city_slug?: string | null;
  area?: string | null;
  price_pkr?: number | null;
  status?: string | null;
  created_at?: string | null;
};

const norm = (v: unknown) => String(v ?? "").toLowerCase().replace(/\s+/g, " ").trim();

/** Unfinished drafts only count as duplicates for this long; older drafts are treated as abandoned. */
export const DUPLICATE_DRAFT_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Returns the seller's existing ad that the new ad repeats, if any: same category, brand, model,
 * storage and city at a price within 10%. Area is ignored (changing the area is not a new phone).
 * Live ads count at any age; hidden drafts (pending) count if they were started in the last 24 hours.
 * `ignoreId` is this form's own ad id, so a retry never blocks itself.
 */
export function findDuplicateListing<T extends DuplicateCandidate>(
  input: Pick<ListingInput, "category" | "brand" | "model" | "storageGb" | "citySlug" | "pricePkr">,
  existing: readonly T[],
  ignoreId?: string | number | null,
  now = Date.now(),
): T | null {
  for (const row of existing) {
    if (ignoreId != null && String(row.id) === String(ignoreId)) continue;
    const status = row.status || "active";
    if (status === "pending_moderation") {
      const at = row.created_at ? Date.parse(row.created_at) : NaN;
      if (!Number.isFinite(at) || now - at > DUPLICATE_DRAFT_WINDOW_MS) continue;
    } else if (status !== "active") continue;
    if (canonicalCategory(row.category || PHONE_CATEGORY) !== canonicalCategory(input.category)) continue;
    if (norm(row.brand) !== norm(input.brand) || norm(row.model) !== norm(input.model)) continue;
    if ((row.storage_gb ?? null) !== (input.storageGb ?? null)) continue;
    if (norm(row.city_slug) !== norm(input.citySlug)) continue;
    const price = Number(row.price_pkr) || 0;
    if (price > 0 && Math.abs(price - input.pricePkr) / price > 0.1) continue;
    return row;
  }
  return null;
}
