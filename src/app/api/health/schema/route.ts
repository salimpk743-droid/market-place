import { NextResponse } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

const PUBLIC_PROBE =
  "id,category,brand,model,price_pkr,status,city_slug,image_url,seller_name,created_at";

/** Live connectivity probe. Never returns row contents or contact numbers. */
export async function GET() {
  const { url, anonKey, configured } = getSupabasePublicConfig();
  if (!configured) {
    return NextResponse.json({
      configured: false,
      listings_reachable: false,
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