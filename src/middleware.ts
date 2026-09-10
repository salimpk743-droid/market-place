import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const APEX_HOST = "mobilemarket.pk";
const WWW_HOST = "www.mobilemarket.pk";

function requestHost(request: NextRequest) {
  const raw = request.headers.get("x-forwarded-host") || request.headers.get("host") || request.nextUrl.hostname;
  return raw.split(":")[0].toLowerCase();
}

export async function middleware(request: NextRequest) {
  if (requestHost(request) === WWW_HOST) {
    const dest = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${APEX_HOST}`);
    return NextResponse.redirect(dest, 308);
  }
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|webmanifest)$).*)"],
};
