import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE, REFRESH_COOKIE, decodeAccessToken } from "./session";

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE)?.value;
}

/** For Server Components / data reads: proxy.ts already guarantees a fresh
 * access token cookie on every protected navigation, so a missing token here
 * means the session is truly gone. */
export async function requireAccessToken(): Promise<string> {
  const token = await getAccessToken();
  if (!token) {
    redirect("/login");
  }
  return token;
}

export async function getCurrentUserPhoneNumber(): Promise<string | null> {
  const token = await getAccessToken();
  if (!token) return null;
  return decodeAccessToken(token)?.sub ?? null;
}

export async function clearSessionCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}
