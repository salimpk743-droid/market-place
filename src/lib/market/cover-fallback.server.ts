import "server-only";

import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { parseListingStoragePath, storagePathsFromStored } from "./media-path";
import { applyCoverFallback, firstImagePathByListing } from "./post-ad";
import type { PublicListing } from "./types";

const healed = new Set<string>();

/**
 * Cards show "No photo" when listings.image_url is empty, even if the ad has photos in listing_images
 * (older ads whose last posting step failed). Fill the cover from the first saved photo, and, when the
 * server has the admin client, save that cover once so the row is fixed for good. The save only touches
 * rows whose cover is still empty and only uses a photo stored under that same ad.
 */
export async function fillMissingCovers(rows: PublicListing[]): Promise<PublicListing[]> {
  const missing = rows.filter((r) => r.id && !storagePathsFromStored(r.image_url).length).map((r) => String(r.id));
  if (!missing.length) return rows;
  const admin = createAdminSupabase();
  const reader = admin || (await createServerSupabase());
  if (!reader) return rows;
  const { data, error } = await reader
    .from("listing_images")
    .select("listing_id, storage_path, public_url, sort_order")
    .in("listing_id", missing);
  if (error || !data) {
    if (error) console.error("[cover-fallback] listing_images read failed:", error.message);
    return rows;
  }
  const first = firstImagePathByListing(data);
  for (const [id, path] of [...first]) {
    const parsed = parseListingStoragePath(path);
    if (!parsed || parsed.listingId !== id.toLowerCase()) first.delete(id);
  }
  if (admin) {
    for (const [id, path] of first) {
      if (healed.has(id)) continue;
      healed.add(id);
      void admin
        .from("listings")
        .update({ image_url: path })
        .eq("id", id)
        .is("image_url", null)
        .then(({ error: updError }) => {
          if (updError) console.error("[cover-fallback] cover save failed", id, updError.message);
          else console.info("[cover-fallback] cover saved from first photo", id);
        });
    }
  }
  return applyCoverFallback(rows, first);
}
