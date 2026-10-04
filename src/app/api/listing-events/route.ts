import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STEPS = new Set(["photo-prepare", "photo-upload", "create", "save", "photos", "activate", "ingest", "duplicate-check", "auth"]);
const clean = (v: unknown, max: number) => String(v ?? "").replace(/[\r\n\t]+/g, " ").slice(0, max);

/**
 * Posting step failures from the Sell form, written to the server log (Vercel runtime logs) so failed
 * posts can be diagnosed. Signed-in sellers only. Nothing is stored in the database.
 */
export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await request.json().catch(() => null);
  const step = clean(body?.step, 40);
  if (!STEPS.has(step)) return NextResponse.json({ ok: false }, { status: 400 });
  console.warn(
    "[post-ad]",
    JSON.stringify({
      step,
      seller: user.id,
      listingId: clean(body?.listingId, 60),
      message: clean(body?.message, 300),
      detail: clean(body?.detail, 200),
      ua: clean(request.headers.get("user-agent"), 160),
    }),
  );
  return NextResponse.json({ ok: true });
}
