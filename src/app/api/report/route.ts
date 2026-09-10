import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { sanitizeText, stripHtml } from "@/lib/market/validation";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Marketplace database is not connected." }, { status: 503 });
  }
  const body = await request.json().catch(() => null);
  const listingId = sanitizeText(body?.listingId || "", 80);
  const kind = body?.kind === "seller" ? "seller" : "listing";
  const reason = sanitizeText(body?.reason || "", 200);
  const details = stripHtml(String(body?.details || "")).slice(0, 4000);
  if (reason.length < 3) {
    return NextResponse.json({ error: "Please choose or describe a reason." }, { status: 400 });
  }
  const { error } = await supabase.rpc("submit_listing_report", {
    p_listing_id: listingId,
    p_kind: kind,
    p_reason: reason,
    p_details: details,
  });
  if (error) {
    if ((error.message || "").includes("rate_limited")) {
      return NextResponse.json({ error: "Too many reports from this account. Try later." }, { status: 429 });
    }
    return NextResponse.json({ error: "Could not submit the report." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
