import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./env";
import { readServerEnv } from "./server-env";

const FALLBACK_URL = "https://evetdzmnisorgoxurvww.supabase.co";

/** Server-only. Never import from a Client Component. Never prefix with NEXT_PUBLIC_. */
export function getSupabaseSecretKey() {
  return readServerEnv("SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_KEY");
}

export function createAdminSupabase(): SupabaseClient | null {
  const secret = getSupabaseSecretKey();
  if (!secret) return null;
  const { url } = getSupabasePublicConfig();
  const host = url.startsWith("https://") ? url : FALLBACK_URL;
  return createClient(host, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
