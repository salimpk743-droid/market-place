import { cityName, isPhoneCategory, ptaMeta } from "./catalog";
import type { PublicListing } from "./types";

export function formatPkr(n: number) {
  return "PKR " + (Number(n) || 0).toLocaleString("en-PK");
}

export function listingTitle(l: Pick<PublicListing, "brand" | "model" | "storage_gb">) {
  const brand = l.brand || "";
  const model = l.model || "";
  const name = model.toLowerCase().startsWith(brand.toLowerCase()) ? model : `${brand} ${model}`.trim();
  return l.storage_gb ? `${name} (${l.storage_gb} GB)` : name;
}

const PTA_TITLE: Record<string, string> = { official: "PTA", "non-pta": "Non-PTA", cpid: "CPID", jv: "JV" };

/**
 * Search-result title for a listing, e.g.
 * "Used Apple iPhone 13 Pro Max 256GB, PTA, Islamabad – Rs 120,000".
 */
export function listingSeoTitle(
  l: Pick<PublicListing, "brand" | "model" | "storage_gb" | "price_pkr" | "city_slug" | "pta_status" | "condition" | "category">,
) {
  const brand = l.brand || "";
  const model = l.model || "";
  const name = model.toLowerCase().startsWith(brand.toLowerCase()) ? model : `${brand} ${model}`.trim();
  const phone = isPhoneCategory(l.category);
  const storage = l.storage_gb ? ` ${l.storage_gb >= 1024 && l.storage_gb % 1024 === 0 ? `${l.storage_gb / 1024}TB` : `${l.storage_gb}GB`}` : "";
  const prefix = phone ? (l.condition === "Box pack" ? "Box-pack " : "Used ") : "";
  const pta = phone && l.pta_status ? PTA_TITLE[l.pta_status] : undefined;
  const price = `Rs ${(Number(l.price_pkr) || 0).toLocaleString("en-PK")}`;
  return `${prefix}${name}${storage}${pta ? `, ${pta}` : ""}, ${cityName(l.city_slug)} – ${price}`;
}

export function listingSlug(l: Pick<PublicListing, "brand" | "model" | "id" | "city_slug" | "slug">) {
  if (l.slug) return l.slug;
  const base = [l.brand, l.model, l.city_slug, String(l.id).slice(0, 8)]
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base;
}

export function listingPath(l: Pick<PublicListing, "brand" | "model" | "id" | "city_slug" | "slug">) {
  return `/listing/${encodeURIComponent(String(l.id))}/${listingSlug(l)}`;
}

export function timeAgo(iso: string | null | undefined) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const hours = Math.round((Date.now() - then) / 36e5);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const d = Math.round(hours / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  const m = Math.round(d / 30);
  return `${m} month${m === 1 ? "" : "s"} ago`;
}

export function ptaBadge(id: string) {
  return ptaMeta(id);
}
