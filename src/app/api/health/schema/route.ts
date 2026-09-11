import { NextResponse } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/env";
import { createAdminSupabase, getSupabaseSecretKey } from "@/lib/supabase/admin";
import { storagePathsFromStored, LISTING_IMAGES_BUCKET } from "@/lib/market/media-path";
import { signMedia, verifyMediaSig } from "@/lib/market/listing-media.server";

const PUBLIC_PROBE =
  "id,category,brand,model,price_pkr,status,city_slug,image_url,seller_name,created_at";

function sanitizeStorageError(err: unknown) {
  if (!err || typeof err !== "object") return "download_failed";
  const rec = err as { message?: string; error?: string; statusCode?: string };
  const raw = String(rec.message || rec.error || rec.statusCode || "download_failed");
  return raw.replace(/eyJ[A-Za-z0-9._-]+/g, "[redacted]").replace(/sb_[a-z]+_[A-Za-z0-9_]+/g, "[redacted]").slice(0, 80);
}

/** Live connectivity probe. Never returns row contents, keys, or contact numbers. */
export async function GET() {
  const { url, anonKey, configured } = getSupabasePublicConfig();
  const hasStorageAdmin = Boolean(getSupabaseSecretKey());
  const exp = Math.floor(Date.now() / 1000) + 60;
  const sig = signMedia("probe", "probe.jpg", exp);
  const hmacSelfOk = verifyMediaSig("probe", "probe.jpg", String(exp), sig);

  let storageReadOk = false;
  let storageError: string | null = hasStorageAdmin ? null : "no_admin";
  const admin = createAdminSupabase();
  if (admin) {
    const { data } = await admin
      .from("listings")
      .select("image_url")
      .eq("status", "active")
      .not("image_url", "is", null)
      .limit(1)
      .maybeSingle();
    const path = storagePathsFromStored((data as { image_url?: string } | null)?.image_url)[0];
    if (!path) {
      storageError = "no_path";
    } else {
      const { data: file, error } = await admin.storage.from(LISTING_IMAGES_BUCKET).download(path);
      storageReadOk = Boolean(file && !error);
      storageError = error ? sanitizeStorageError(error) : file ? null : "empty";
    }
  }

  if (!configured) {
    return NextResponse.json({
      configured: false,
      listings_reachable: false,
      has_storage_admin: hasStorageAdmin,
      hmac_self_ok: hmacSelfOk,
      storage_read_ok: storageReadOk,
      storage_error: storageError,
      note: "Publishable URL and anon key are not set in this environment.",
    });
  }

  const headers = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    Accept: "application/json",
  };

  const listingsRes = await fetch(
    `${url.replace(/\/$/, "")}/rest/v1/listings?select=${PUBLIC_PROBE}&limit=1`,
    { headers, cache: "no-store" },
  );

  let listingsJson: unknown = null;
  try {
    listingsJson = await listingsRes.json();
  } catch {
    listingsJson = null;
  }

  const rows = Array.isArray(listingsJson) ? listingsJson : [];
  const sampleKeys = rows[0] && typeof rows[0] === "object" ? Object.keys(rows[0] as object).sort() : [];
  const denied =
    !listingsRes.ok &&
    typeof listingsJson === "object" &&
    listingsJson !== null &&
    "message" in listingsJson;

  return NextResponse.json({
    configured: true,
    listings_reachable: listingsRes.ok && Array.isArray(listingsJson),
    listings_http_status: listingsRes.status,
    has_storage_admin: hasStorageAdmin,
    hmac_self_ok: hmacSelfOk,
    storage_read_ok: storageReadOk,
    storage_error: storageError,
    row_count_sample: rows.length,
    public_fields_present: sampleKeys,
    exposes_contact_phone: sampleKeys.includes("contact_phone"),
    exposes_seller_id: sampleKeys.includes("seller_id"),
    note: listingsRes.ok
      ? "Public listings select succeeded with the publishable key."
      : denied
        ? "Listings select was denied. Check grants/RLS."
        : "Listings select failed.",
  });
}
