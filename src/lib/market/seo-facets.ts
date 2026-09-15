import { createServerSupabase } from "@/lib/supabase/server";
import { stripPrivateFields } from "@/lib/market/public-fields";
import { categoryFilterValues } from "@/lib/market/catalog";
import { PUBLIC_LISTING_COLUMNS, type PublicListing } from "@/lib/market/types";
import { mediaUrlForPath } from "@/lib/market/listing-media.server";
import { storagePathsFromStored } from "@/lib/market/media-path";

const PUBLIC_SELECT = PUBLIC_LISTING_COLUMNS.join(",");
const PUBLIC_SELECT_LEGACY = PUBLIC_LISTING_COLUMNS.filter((column) => column !== "category").join(",");

function withSignedCover(row: PublicListing): PublicListing {
  const paths = storagePathsFromStored(row.image_url);
  return { ...row, image_url: paths.length ? mediaUrlForPath(paths[0]) : null };
}

function isMissingCategoryColumn(message?: string) {
  return Boolean(message && /category/i.test(message) && /column|schema cache|does not exist/i.test(message));
}

function asRows(data: unknown): PublicListing[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const record = row && typeof row === "object" && !Array.isArray(row)
      ? (row as Record<string, unknown>)
      : {};
    return withSignedCover(stripPrivateFields(record));
  });
}

export async function searchPhoneSeoListings({
  brand,
  city,
  model,
  limit = 24,
}: {
  brand?: string;
  city?: string;
  model?: string;
  limit?: number;
}) {
  const supabase = await createServerSupabase();
  if (!supabase) return { rows: [] as PublicListing[], total: 0 };

  const applyFilters = (base: any) => {
    let query = base
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (brand) query = query.eq("brand", brand);
    if (city) query = query.eq("city_slug", city);
    if (model) query = query.ilike("model", model);
    return query;
  };

  let { data, count, error } = await applyFilters(
    supabase.from("listings").select(PUBLIC_SELECT, { count: "exact" }).in("category", categoryFilterValues("phone")),
  );

  if (error && isMissingCategoryColumn(error.message)) {
    const retry = await applyFilters(supabase.from("listings").select(PUBLIC_SELECT_LEGACY, { count: "exact" }));
    data = retry.data;
    count = retry.count;
    error = retry.error;
  }

  if (error) return { rows: [] as PublicListing[], total: 0 };
  return { rows: asRows(data), total: count || 0 };
}
