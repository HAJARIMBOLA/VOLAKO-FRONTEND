"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { registerUser, loginUser, logoutUser } from "@/lib/data/auth";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  defaultAccessCookieOptions,
  defaultRefreshCookieOptions,
} from "@/lib/session";
import { clearSessionCookies } from "@/lib/session-server";
import { ApiError } from "@/lib/api-error";
import type { AuthResponse } from "@/lib/types";

export type AuthFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

const RegisterSchema = z.object({
  fullName: z.string().trim().min(2, "Le nom complet doit contenir au moins 2 caractères."),
  email: z.string().trim().min(1, "L'email est requis.").email("Adresse email invalide."),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});

const LoginSchema = z.object({
  email: z.string().trim().min(1, "L'email est requis."),
  password: z.string().min(1, "Le mot de passe est requis."),
});

async function setSessionCookies(auth: AuthResponse) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, auth.accessToken, defaultAccessCookieOptions());
  cookieStore.set(REFRESH_COOKIE, auth.refreshToken, defaultRefreshCookieOptions());
}

export async function registerAction(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = RegisterSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const auth = await registerUser(parsed.data);
    await setSessionCookies(auth);
  } catch (error) {
    if (error instanceof ApiError) {
      return { message: error.message };
    }
    return { message: "Impossible de créer le compte pour le moment. Réessayez." };
  }

  redirect("/dashboard");
}

export async function loginAction(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const auth = await loginUser(parsed.data);
    await setSessionCookies(auth);
  } catch (error) {
    if (error instanceof ApiError) {
      return { message: error.message };
    }
    return { message: "Connexion impossible pour le moment. Réessayez." };
  }

  const next = formData.get("next");
  redirect(typeof next === "string" && next.startsWith("/") ? next : "/dashboard");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (refreshToken) {
    try {
      await logoutUser(refreshToken);
    } catch {
      // Best-effort: the cookies are cleared regardless.
    }
  }

  await clearSessionCookies();
  redirect("/login");
}
