import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion — VOLAKO" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-foreground">Bon retour</h1>
        <p className="text-sm text-muted-foreground">Connectez-vous pour retrouver vos finances.</p>
      </div>
      <LoginForm next={next} />
    </div>
  );
}
