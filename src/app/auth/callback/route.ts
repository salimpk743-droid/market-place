import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  if (requestUrl.searchParams.get("error")) {
    return NextResponse.redirect(new URL("/login?error=oauth_provider_failed", requestUrl.origin));
  }
  if (code) {
    const supabase = await createServerSupabase();
    if (!supabase) {
      return NextResponse.redirect(new URL("/login?error=auth_not_configured", requestUrl.origin));
    }
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL("/login?error=oauth_exchange_failed", requestUrl.origin));
    }
  }
  return NextResponse.redirect(new URL("/my-ads", requestUrl.origin));
}
