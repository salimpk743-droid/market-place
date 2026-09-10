import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSupabasePublicConfig } from "@/lib/supabase/env";
import { ingestListingImage } from "@/lib/market/listing-media.server";
import { parseListingStoragePath } from "@/lib/market/media-path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function clientFromRequest(request: Request) {
  const header = request.headers.get("authorization") || "";
  const token = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  if (token) {
    const { url, anonKey, configured } = getSupabasePublicConfig();
    if (!configured) return { supabase: null, user: null };
    const supabase = createClient(url, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data } = await supabase.auth.getUser(token);
    return { supabase, user: data.user };
  }
  const supabase = await createServerSupabase();
  if (!supabase) return { supabase: null, user: null };
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user };
}

export async function POST(request: Request) {
  const { supabase, user } = await clientFromRequest(request);
  if (!supabase || !user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const listingId = String(body?.listingId || "");
  const path = String(body?.path || "");
  const parsed = parseListingStoragePath(path);
  if (!parsed || parsed.listingId !== listingId.toLowerCase() || parsed.sellerId !== user.id.toLowerCase()) {
    return NextResponse.json({ error: "Invalid photo path." }, { status: 400 });
  }

  const { data: owned } = await supabase.from("listings").select("id").eq("id", listingId).eq("seller_id", user.id).maybeSingle();
  if (!owned) {
    return NextResponse.json({ error: "Not your listing." }, { status: 403 });
  }

  const stored = await ingestListingImage(parsed.path, supabase);
  if (!stored) {
    return NextResponse.json({ error: "Could not publish that photo." }, { status: 400 });
  }
  return NextResponse.json({ ok: true, filename: parsed.filename });
}
