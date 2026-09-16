import { Wallet } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60rem 30rem at 15% -10%, color-mix(in srgb, var(--primary) 22%, transparent), transparent), radial-gradient(50rem 25rem at 110% 10%, color-mix(in srgb, var(--success) 12%, transparent), transparent)",
        }}
      />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <Wallet className="size-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-foreground">VOLAKO</p>
            <p className="text-sm text-muted-foreground">Votre argent, clair et sous contrôle</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/20">{children}</div>
      </div>
    </div>
  );
}
