import "server-only";
import { BACKEND_URL } from "./config";
import { ApiError } from "./api-error";
import type { ApiErrorBody } from "./types";

interface BackendFetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  accessToken?: string;
  searchParams?: Record<string, string | number | undefined>;
}

export async function backendFetch<T>(path: string, options: BackendFetchOptions = {}): Promise<T> {
  const { method = "GET", body, accessToken, searchParams } = options;

  const url = new URL(path, BACKEND_URL);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const errorBody = data as ApiErrorBody | undefined;
    throw new ApiError(response.status, errorBody?.error ?? "UNKNOWN_ERROR", errorBody?.message ?? "Une erreur est survenue");
  }

  return data as T;
}
