import { createServerSupabase } from "@/lib/supabase/server";
import { stripPrivateFields } from "@/lib/market/public-fields";
import { PUBLIC_LISTING_COLUMNS, type PublicListing } from "@/lib/market/types";
import { mediaUrlForPath } from "@/lib/market/listing-media.server";
import { storagePathsFromStored } from "@/lib/market/media-path";

const SELECT = PUBLIC_LISTING_COLUMNS.join(",");

function withSignedCover(row: PublicListing): PublicListing {
  const paths = storagePathsFromStored(row.image_url);
  return { ...row, image_url: paths.length ? mediaUrlForPath(paths[0]) : null };
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

  let query = supabase
    .from("listings")
    .select(SELECT, { count: "exact" })
    .eq("status", "active")
    .eq("category", "phone")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (brand) query = query.eq("brand", brand);
  if (city) query = query.eq("city_slug", city);
  if (model) query = query.ilike("model", model);

  const { data, count } = await query;
  const rows = Array.isArray(data)
    ? data.map((row) => withSignedCover(stripPrivateFields(row)))
    : [];

  return { rows, total: count || 0 };
}
