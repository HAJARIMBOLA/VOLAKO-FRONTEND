import "server-only";
import { cookies } from "next/headers";
import { backendFetch } from "./backend";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  defaultAccessCookieOptions,
  defaultRefreshCookieOptions,
} from "./session";
import type { AuthResponse } from "./types";

/** Rotates the session using the refresh cookie. Only callable from a Server
 * Action or Route Handler (cookies() must be writable). Returns the new
 * access token, or null if the refresh token is missing/expired/revoked. */
export async function refreshSessionCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return null;

  try {
    const auth = await backendFetch<AuthResponse>("/api/auth/refresh-token", {
      method: "POST",
      body: { refreshToken },
    });

    cookieStore.set(ACCESS_COOKIE, auth.accessToken, defaultAccessCookieOptions());
    cookieStore.set(REFRESH_COOKIE, auth.refreshToken, defaultRefreshCookieOptions());

    return auth.accessToken;
  } catch {
    cookieStore.delete(ACCESS_COOKIE);
    cookieStore.delete(REFRESH_COOKIE);
    return null;
  }
}
