const FALLBACK_URL = "https://evetdzmnisorgoxurvww.supabase.co";

export function getSupabasePublicConfig() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  let anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

  // If Vercel inlined the two values swapped, detect by shape and unswap.
  if (url && !url.startsWith("https://") && anonKey.startsWith("https://")) {
    const swapped = url;
    url = anonKey;
    anonKey = swapped;
  }
  if (!url.startsWith("https://")) url = FALLBACK_URL;

  return {
    url,
    anonKey,
    configured: Boolean(url.startsWith("https://") && anonKey && !anonKey.startsWith("https://")),
  };
}
