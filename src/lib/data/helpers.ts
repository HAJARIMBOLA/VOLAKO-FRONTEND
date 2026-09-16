import "server-only";
import { requireAccessToken } from "../session-server";
import { refreshSessionCookies } from "../refresh";
import { ApiError } from "../api-error";

/** Server Components: proxy.ts already refreshed the session before this
 * render started, so a plain read is enough. */
export async function withAuth<T>(fn: (token: string) => Promise<T>): Promise<T> {
  const token = await requireAccessToken();
  return fn(token);
}

/** Server Actions: cookies are writable here, so retry once through a
 * refresh if the access token expired mid-session. */
export async function withAuthRetry<T>(fn: (token: string) => Promise<T>): Promise<T> {
  const token = await requireAccessToken();
  try {
    return await fn(token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      const newToken = await refreshSessionCookies();
      if (newToken) {
        return fn(newToken);
      }
    }
    throw error;
  }
}
