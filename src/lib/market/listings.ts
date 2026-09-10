import { createServerSupabase } from "@/lib/supabase/server";
import { PAGE_SIZE } from "./site";
import { stripPrivateFields } from "./public-fields";
import { ACCESSORY_SLUGS, inferCategory, canonicalCategory, categoryFilterValues, PHONE_CATEGORY } from "./catalog";
import { OWNER_LISTING_COLUMNS, PUBLIC_LISTING_COLUMNS, type ListingFilters, type ListingImage, type PublicListing } from "./types";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { downloadListingImage, mediaUrlsForPaths, mediaUrlForPath, readCachedImage } from "./listing-media.server";
import { storagePathsFromStored } from "./media-path";

const PUBLIC_SELECT = PUBLIC_LISTING_COLUMNS.join(",");
const OWNER_SELECT = OWNER_LISTING_COLUMNS.join(",");
const PUBLIC_SELECT_LEGACY = PUBLIC_LISTING_COLUMNS.filter((c) => c !== "category").join(",");

function asRecord(row: unknown): Record<string, unknown> | null {
  if (!row || typeof row !== "object" || Array.isArray(row)) return null;
  return row as Record<string, unknown>;
}

function asListing(row: unknown): PublicListing | null {
  const rec = asRecord(row);
  if (!rec) return null;
  return stripPrivateFields(rec);
}

function asListings(data: unknown): PublicListing[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => stripPrivateFields(asRecord(row) || {}));
}

function withSignedCover(listing: PublicListing): PublicListing {
  const paths = storagePathsFromStored(listing.image_url);
  const signed = paths.length ? mediaUrlForPath(paths[0]) : null;
  return { ...listing, image_url: signed };
}

function withSignedCovers(listings: PublicListing[]): PublicListing[] {
  return listings.map(withSignedCover);
}

async function warmStoredImages(paths: string[], client: NonNullable<Awaited<ReturnType<typeof createServerSupabase>>>) {
  const unique = Array.from(new Set(paths)).filter((path) => !readCachedImage(path)).slice(0, 8);
  if (!unique.length) return;
  await Promise.all(unique.map((path) => downloadListingImage(path, [createAdminSupabase(), client])));
}

function sanitizeSearchTerm(raw: string) {
  return raw
    .replace(/[^a-zA-Z0-9+\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function isMissingCategoryColumn(message?: string) {
  return Boolean(message && /category/i.test(message) && /column|schema cache|does not exist/i.test(message));
}

export async function getCurrentUser() {
  const supabase = await createServerSupabase();
  if (!supabase) return { supabase: null, user: null };
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user };
}

function applyListingFilters(q: any, filters: ListingFilters, allowCategory: boolean) {
  let next = q;
  if (allowCategory && filters.category) {
    if (filters.category === "accessories") {
      const accessoryValues = ACCESSORY_SLUGS.flatMap((slug) => categoryFilterValues(slug));
      next = next.in("category", accessoryValues);
    } else {
      const values = categoryFilterValues(filters.category);
      next = values.length > 1 ? next.in("category", values) : next.eq("category", values[0]);
    }
  }
  if (filters.brand) next = next.eq("brand", filters.brand);
  if (filters.city) next = next.eq("city_slug", filters.city);
  if (filters.area) next = next.eq("area", filters.area);
  if (filters.pta) next = next.eq("pta_status", filters.pta);
  if (filters.storage) next = next.eq("storage_gb", Number(filters.storage));
  if (filters.condition) next = next.eq("condition", filters.condition);
  if (filters.minPrice) next = next.gte("price_pkr", Number(filters.minPrice));
  if (filters.maxPrice) next = next.lte("price_pkr", Number(filters.maxPrice));
  if (filters.q) {
    const term = sanitizeSearchTerm(filters.q);
    if (term) {
      const cols = allowCategory
        ? `brand.ilike.%${term}%,model.ilike.%${term}%,color.ilike.%${term}%,description.ilike.%${term}%,category.ilike.%${term}%`
        : `brand.ilike.%${term}%,model.ilike.%${term}%,color.ilike.%${term}%,description.ilike.%${term}%`;
      next = next.or(cols);
    }
  }
  return next;
}

export async function searchListings(filters: ListingFilters) {
  const client = await createServerSupabase();
  if (!client) {
    return { rows: [] as PublicListing[], total: 0, page: 1, pageCount: 1, configured: false };
  }
  const page = Math.max(1, Number(filters.page) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const inferred = !filters.category && filters.q ? inferCategory(filters.q) : undefined;
  const resolved: ListingFilters = { ...filters };
  if (inferred) resolved.category = inferred;
  if (resolved.category && resolved.category !== "accessories") {
    resolved.category = canonicalCategory(resolved.category);
  }
  const db = client;

  const run = (select: string, allowCategory: boolean) => {
    const base = db
      .from("listings")
      .select(select, { count: "exact" })
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .range(from, to);
    return applyListingFilters(base, resolved, allowCategory);
  };

  let { data, count, error } = await run(PUBLIC_SELECT, true);
  if (error && isMissingCategoryColumn(error.message)) {
    const retry = await run(PUBLIC_SELECT_LEGACY, false);
    data = retry.data;
    count = retry.count;
    error = retry.error;
  }
  if (error) {
    return { rows: [] as PublicListing[], total: 0, page, pageCount: 1, configured: true, error: error.message };
  }
  const rows = withSignedCovers(asListings(data));
  const total = count || 0;
  return {
    rows,
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    configured: true,
  };
}

export async function isOwnListing(id: string) {
  const { supabase, user } = await getCurrentUser();
  if (!supabase || !user) return false;
  const { data } = await supabase.from("listings").select("id").eq("id", id).eq("seller_id", user.id).maybeSingle();
  return Boolean(data);
}

export async function getOwnedListingById(id: string) {
  const { supabase, user } = await getCurrentUser();
  if (!supabase || !user) return { user, listing: null as PublicListing | null };
  let { data, error } = await supabase
    .from("listings")
    .select(OWNER_SELECT)
    .eq("id", id)
    .eq("seller_id", user.id)
    .maybeSingle();
  if (error && isMissingCategoryColumn(error.message)) {
    const retry = await supabase
      .from("listings")
      .select(PUBLIC_SELECT_LEGACY)
      .eq("id", id)
      .eq("seller_id", user.id)
      .maybeSingle();
    data = retry.data;
  }
  return { user, listing: asListing(data) };
}

export async function getListingById(id: string) {
  const supabase = await createServerSupabase();
  if (!supabase) return null;
  let { data, error } = await supabase.from("listings").select(PUBLIC_SELECT).eq("id", id).maybeSingle();
  if (error && isMissingCategoryColumn(error.message)) {
    const retry = await supabase.from("listings").select(PUBLIC_SELECT_LEGACY).eq("id", id).maybeSingle();
    data = retry.data;
  }
  const listing = asListing(data);
  return listing ? withSignedCover(listing) : null;
}

export async function getOwnListingContact(id: string) {
  const { supabase, user } = await getCurrentUser();
  if (!supabase || !user) return "";
  const { data, error } = await supabase.rpc("get_own_listing_contact", { p_listing_id: id });
  if (error || !data) return "";
  const phone = (data as { contact_phone?: string }).contact_phone;
  return phone ? String(phone) : "";
}

export async function getListingImages(listingId: string): Promise<ListingImage[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return [];
  let { data, error } = await supabase.from("listings").select("id, image_url, status").eq("id", listingId).maybeSingle();
  if (error || !data) return [];
  const paths = storagePathsFromStored((data as { image_url?: string }).image_url);
  const extra = await supabase
    .from("listing_images")
    .select("id, storage_path, public_url, sort_order")
    .eq("listing_id", listingId)
    .order("sort_order", { ascending: true });
  if (extra.data) {
    const sorted = [...extra.data].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
    for (const row of sorted) {
      paths.push(...storagePathsFromStored(row.storage_path), ...storagePathsFromStored(row.public_url));
    }
  }
  await warmStoredImages(paths, supabase);
  return mediaUrlsForPaths(paths).map((img) => ({ id: img.id, url: img.url }));
}

export async function getRelatedListings(listing: Pick<PublicListing, "id" | "brand" | "category">) {
  const supabase = await createServerSupabase();
  if (!supabase) return [];
  let q = supabase
    .from("listings")
    .select(PUBLIC_SELECT)
    .eq("status", "active")
    .eq("brand", listing.brand)
    .neq("id", listing.id)
    .order("created_at", { ascending: false })
    .limit(3);
  if (listing.category) q = q.eq("category", listing.category);
  let { data, error } = await q;
  if (error && isMissingCategoryColumn(error.message)) {
    const retry = await supabase
      .from("listings")
      .select(PUBLIC_SELECT_LEGACY)
      .eq("status", "active")
      .eq("brand", listing.brand)
      .neq("id", listing.id)
      .order("created_at", { ascending: false })
      .limit(3);
    data = retry.data;
  }
  return withSignedCovers(asListings(data));
}

export async function recentListings(limit = 12) {
  const supabase = await createServerSupabase();
  if (!supabase) return { rows: [] as PublicListing[], configured: false };
  let { data, error } = await supabase
    .from("listings")
    .select(PUBLIC_SELECT)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error && isMissingCategoryColumn(error.message)) {
    const retry = await supabase
      .from("listings")
      .select(PUBLIC_SELECT_LEGACY)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(limit);
    data = retry.data;
  }
  return {
    rows: withSignedCovers(asListings(data)),
    configured: true,
  };
}

export async function featuredListings(limit = 6) {
  const supabase = await createServerSupabase();
  if (!supabase) return [];
  let { data, error } = await supabase
    .from("listings")
    .select(PUBLIC_SELECT)
    .eq("status", "active")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error && isMissingCategoryColumn(error.message)) {
    const retry = await supabase
      .from("listings")
      .select(PUBLIC_SELECT_LEGACY)
      .eq("status", "active")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    data = retry.data;
  }
  return withSignedCovers(asListings(data));
}

export async function countBy(column: "brand" | "city_slug" | "pta_status" | "category") {
  const supabase = await createServerSupabase();
  if (!supabase) return {} as Record<string, number>;
  const { data, error } = await supabase.from("listings").select(column).eq("status", "active");
  if (error) return {} as Record<string, number>;
  const counts: Record<string, number> = {};
  (data || []).forEach((row) => {
    const rec = asRecord(row);
    const key = String(rec?.[column] || (column === "category" ? PHONE_CATEGORY : ""));
    if (!key) return;
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

export async function myListings() {
  const { supabase, user } = await getCurrentUser();
  if (!supabase || !user) return { user, rows: [] as PublicListing[] };
  let { data, error } = await supabase
    .from("listings")
    .select(OWNER_SELECT)
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false });
  if (error && isMissingCategoryColumn(error.message)) {
    const retry = await supabase
      .from("listings")
      .select(PUBLIC_SELECT_LEGACY)
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });
    data = retry.data;
  }
  const rawRows = asListings(data);
  await warmStoredImages(
    rawRows.flatMap((row) => storagePathsFromStored(row.image_url)),
    supabase,
  );
  return {
    user,
    rows: withSignedCovers(rawRows),
  };
}
