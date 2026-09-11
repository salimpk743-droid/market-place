import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSupabasePublicConfig } from "@/lib/supabase/env";
import { downloadListingImage, readCachedImage, verifyMediaSig } from "@/lib/market/listing-media.server";
import { storagePathsFromStored, parseListingStoragePath } from "@/lib/market/media-path";
import { PUBLIC_LISTING_COLUMNS } from "@/lib/market/types";

const FILENAME_RE = /^[A-Za-z0-9._-]+\.(?:jpe?g|png|webp)$/i;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function notFound(reason: string) {
  return new NextResponse("Not found", {
    status: 404,
    headers: { "x-media-reason": reason },
  });
}

function publicClient() {
  const { url, anonKey, configured } = getSupabasePublicConfig();
  if (!configured) return null;
  return createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ listingId: string; filename: string }> },
) {
  const { listingId, filename } = await params;
  const file = decodeURIComponent(filename || "");
  if (!listingId || listingId.length > 80 || !FILENAME_RE.test(file)) {
    return notFound("filename");
  }

  const admin = createAdminSupabase();
  const sessionClient = await createServerSupabase();
  const supabase = sessionClient || publicClient();
  if (!supabase && !admin) return notFound("no_client");

  const url = new URL(request.url);
  const signed = verifyMediaSig(listingId, file, url.searchParams.get("exp") || "", url.searchParams.get("sig") || "");

  let user = null;
  if (sessionClient) {
    const { data: userData } = await sessionClient.auth.getUser();
    user = userData.user;
  }

  const select = PUBLIC_LISTING_COLUMNS.join(",");
  const reader = admin || supabase;
  if (!reader) return notFound("no_client");
  const { data: listing } = await reader.from("listings").select(select).eq("id", listingId).maybeSingle();
  if (!listing) return notFound("listing");

  const status = String((listing as { status?: string }).status || "");
  const publicOk = status === "active" || status === "sold";
  let isOwner = false;
  if (user && sessionClient) {
    const owned = await sessionClient.from("listings").select("id").eq("id", listingId).eq("seller_id", user.id).maybeSingle();
    isOwner = Boolean(owned.data);
  }
  if (!publicOk && !isOwner) return notFound("status");
  if (!signed && !isOwner) return notFound("hmac");

  const paths = storagePathsFromStored((listing as { image_url?: string }).image_url);
  const images = await reader.from("listing_images").select("storage_path, public_url").eq("listing_id", listingId);
  if (images.data) {
    for (const row of images.data) {
      paths.push(...storagePathsFromStored(row.storage_path), ...storagePathsFromStored(row.public_url));
    }
  }
  const wanted = file.toLowerCase();
  const match = paths
    .map(parseListingStoragePath)
    .find((p) => p && p.listingId === listingId.toLowerCase() && p.filename.toLowerCase() === wanted);
  if (!match) return notFound("path");

  const image =
    readCachedImage(match.path) || (await downloadListingImage(match.path, [admin, sessionClient, supabase]));
  if (!image) return notFound("download");

  return new NextResponse(new Uint8Array(image.bytes), {
    status: 200,
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": publicOk ? "public, max-age=300, stale-while-revalidate=3600" : "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
