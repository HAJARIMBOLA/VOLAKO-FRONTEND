import "server-only";
import { backendFetch } from "../backend";
import type { AuthResponse } from "../types";

export function registerUser(input: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return backendFetch<AuthResponse>("/api/auth/register", { method: "POST", body: input });
}

export function loginUser(input: { identifier: string; password: string }): Promise<AuthResponse> {
  return backendFetch<AuthResponse>("/api/auth/login", { method: "POST", body: input });
}

export function logoutUser(refreshToken: string): Promise<void> {
  return backendFetch<void>("/api/auth/logout", { method: "POST", body: { refreshToken } });
}
