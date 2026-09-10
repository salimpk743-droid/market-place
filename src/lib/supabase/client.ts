"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "./env";

export function createBrowserSupabase() {
  const { url, anonKey, configured } = getSupabasePublicConfig();
  if (!configured) return null;
  return createBrowserClient(url, anonKey);
}
