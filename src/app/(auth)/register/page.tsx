import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = { title: "Créer un compte — VOLAKO" };

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-foreground">Créer votre compte</h1>
        <p className="text-sm text-muted-foreground">
          Des catégories de base (Nourriture, Transport, Salaire…) sont créées automatiquement.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
