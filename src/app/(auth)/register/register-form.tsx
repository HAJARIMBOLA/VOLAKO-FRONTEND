"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type AuthFormState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";

const initialState: AuthFormState = undefined;

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="fullName">Nom complet</Label>
        <Input id="fullName" name="fullName" placeholder="Nija Rakoto" autoComplete="name" required />
        <FieldError message={state?.errors?.fullName?.[0]} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="vous@exemple.mg" autoComplete="email" required />
        <FieldError message={state?.errors?.email?.[0]} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required />
        <p className="text-xs text-muted-foreground">8 caractères minimum.</p>
        <FieldError message={state?.errors?.password?.[0]} />
      </div>

      {state?.message ? (
        <p role="alert" className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Création…" : "Créer mon compte"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Déjà inscrit ?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
