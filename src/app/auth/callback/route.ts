import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { safeInternalPath } from "@/lib/market/site";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeInternalPath(requestUrl.searchParams.get("next"), "/my-ads");
  if (requestUrl.searchParams.get("error")) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}`, requestUrl.origin));
  }
  if (code) {
    const supabase = await createServerSupabase();
    if (supabase) await supabase.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
