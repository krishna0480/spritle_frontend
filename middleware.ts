import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS  = ["/", "/login", "/sign_up"];
const AUTH_PAGES    = ["/login", "/sign_up"];
// HubSpot OAuth callback must be accessible without a session
const OPEN_PATHS    = ["/hubspot/callback"];

export function middleware(request: NextRequest) {
  const token       = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Always allow open paths (OAuth callbacks, etc.)
  if (OPEN_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Logged-in user visiting auth pages → send to dashboard
  if (token && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated user visiting a protected page → send to login
  if (!token && !PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
