import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { SUPPORT_EMAIL } from "@/lib/market/site";

export async function POST() {
  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Marketplace database is not connected." }, { status: 503 });
  }
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return NextResponse.json({ error: "Sign in to delete your account." }, { status: 401 });
  }
  const { error } = await supabase.rpc("delete_own_account");
  if (error) {
    return NextResponse.json({ error: `Could not complete deletion. Email ${SUPPORT_EMAIL}` }, { status: 400 });
  }
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
