import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./env";

/** Server-only. Never import from a Client Component. */
export function getSupabaseSecretKey() {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_KEY?.trim() ||
    ""
  );
}

export function createAdminSupabase(): SupabaseClient | null {
  const { url, configured } = getSupabasePublicConfig();
  const secret = getSupabaseSecretKey();
  if (!configured || !secret) return null;
  return createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
