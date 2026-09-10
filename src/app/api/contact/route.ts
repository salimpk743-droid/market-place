import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Marketplace database is not connected." }, { status: 503 });
  }
  const body = await request.json().catch(() => null);
  const listingId = String(body?.listingId || "");
  if (!listingId || listingId.length > 80) {
    return NextResponse.json({ error: "Invalid listing." }, { status: 400 });
  }
  const { data, error } = await supabase.rpc("reveal_listing_contact", { p_listing_id: listingId });
  if (error) {
    const msg = error.message || "";
    if (msg.includes("rate_limited")) {
      return NextResponse.json({ error: "Too many contact requests. Try again later." }, { status: 429 });
    }
    if (msg.includes("listing_unavailable")) {
      return NextResponse.json({ error: "This listing is not available." }, { status: 404 });
    }
    return NextResponse.json({ error: "Could not load seller contact." }, { status: 400 });
  }
  const payload = data as { seller_name?: string; contact_phone?: string };
  return NextResponse.json({
    seller_name: payload.seller_name,
    contact_phone: payload.contact_phone,
  });
}
