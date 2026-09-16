export const ACCESS_COOKIE = "volako_access";
export const REFRESH_COOKIE = "volako_refresh";

export interface AccessTokenPayload {
  sub: string;
  userId: number;
  exp: number;
}

/** Decodes (never verifies) a JWT payload — good enough for expiry checks; the
 * backend is the only party that ever verifies the signature. */
export function decodeAccessToken(token: string): AccessTokenPayload | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "="));
    return JSON.parse(json) as AccessTokenPayload;
  } catch {
    return null;
  }
}

export function isAccessTokenExpired(token: string | undefined, skewSeconds = 15): boolean {
  if (!token) return true;
  const payload = decodeAccessToken(token);
  if (!payload) return true;
  return payload.exp * 1000 - skewSeconds * 1000 < Date.now();
}

interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  path: string;
  maxAge?: number;
}

export function accessCookieOptions(maxAgeSeconds: number): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export function refreshCookieOptions(maxAgeSeconds: number): CookieOptions {
  return accessCookieOptions(maxAgeSeconds);
}

const ACCESS_TOKEN_MAX_AGE_SECONDS = 15 * 60;
const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export function defaultAccessCookieOptions(): CookieOptions {
  return accessCookieOptions(ACCESS_TOKEN_MAX_AGE_SECONDS);
}

export function defaultRefreshCookieOptions(): CookieOptions {
  return refreshCookieOptions(REFRESH_TOKEN_MAX_AGE_SECONDS);
}
