import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { downloadListingImage, readCachedImage, verifyMediaSig } from "@/lib/market/listing-media.server";
import { storagePathsFromStored, parseListingStoragePath } from "@/lib/market/media-path";
import { PUBLIC_LISTING_COLUMNS } from "@/lib/market/types";

const FILENAME_RE = /^[A-Za-z0-9._-]+\.(?:jpe?g|png|webp)$/i;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ listingId: string; filename: string }> },
) {
  const { listingId, filename } = await params;
  const file = decodeURIComponent(filename || "");
  if (!listingId || listingId.length > 80 || !FILENAME_RE.test(file)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const supabase = await createServerSupabase();
  if (!supabase) return new NextResponse("Not found", { status: 404 });

  const url = new URL(request.url);
  const signed = verifyMediaSig(listingId, file, url.searchParams.get("exp") || "", url.searchParams.get("sig") || "");

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  const select = PUBLIC_LISTING_COLUMNS.join(",");
  const { data: listing } = await supabase.from("listings").select(select).eq("id", listingId).maybeSingle();
  if (!listing) return new NextResponse("Not found", { status: 404 });

  const status = String((listing as { status?: string }).status || "");
  const publicOk = status === "active" || status === "sold";
  let isOwner = false;
  if (user) {
    const owned = await supabase.from("listings").select("id").eq("id", listingId).eq("seller_id", user.id).maybeSingle();
    isOwner = Boolean(owned.data);
  }
  if (!publicOk && !isOwner) return new NextResponse("Not found", { status: 404 });
  if (!signed && !isOwner) return new NextResponse("Not found", { status: 404 });

  const paths = storagePathsFromStored((listing as { image_url?: string }).image_url);
  const images = await supabase.from("listing_images").select("storage_path, public_url").eq("listing_id", listingId);
  if (images.data) {
    for (const row of images.data) {
      paths.push(...storagePathsFromStored(row.storage_path), ...storagePathsFromStored(row.public_url));
    }
  }
  const match = paths
    .map(parseListingStoragePath)
    .find((p) => p && p.listingId === listingId.toLowerCase() && p.filename.toLowerCase() === file.toLowerCase());
  if (!match) return new NextResponse("Not found", { status: 404 });

  const image =
    readCachedImage(match.path) || (await downloadListingImage(match.path, [createAdminSupabase(), supabase]));
  if (!image) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(new Uint8Array(image.bytes), {
    status: 200,
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": publicOk ? "public, max-age=300, stale-while-revalidate=3600" : "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
