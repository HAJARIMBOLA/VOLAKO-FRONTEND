import { NextResponse, type NextRequest } from "next/server";
import { BACKEND_URL } from "@/lib/config";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  isAccessTokenExpired,
  defaultAccessCookieOptions,
  defaultRefreshCookieOptions,
} from "@/lib/session";
import type { AuthResponse } from "@/lib/types";

const PROTECTED_PREFIXES = ["/dashboard", "/accounts", "/categories", "/transactions"];
const AUTH_PAGES = ["/login", "/register"];

async function tryRefresh(refreshToken: string): Promise<AuthResponse | null> {
  try {
    const response = await fetch(new URL("/api/auth/refresh-token", BACKEND_URL), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as AuthResponse;
  } catch {
    return null;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const isAuthPage = AUTH_PAGES.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected && !isAuthPage && pathname !== "/") {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  let validAccessToken = accessToken && !isAccessTokenExpired(accessToken) ? accessToken : null;

  const response = NextResponse.next();

  if (!validAccessToken && refreshToken) {
    const refreshed = await tryRefresh(refreshToken);
    if (refreshed) {
      validAccessToken = refreshed.accessToken;
      response.cookies.set(ACCESS_COOKIE, refreshed.accessToken, defaultAccessCookieOptions());
      response.cookies.set(REFRESH_COOKIE, refreshed.refreshToken, defaultRefreshCookieOptions());
    } else {
      response.cookies.delete(ACCESS_COOKIE);
      response.cookies.delete(REFRESH_COOKIE);
    }
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL(validAccessToken ? "/dashboard" : "/login", request.url));
  }

  if (isProtected && !validAccessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && validAccessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
