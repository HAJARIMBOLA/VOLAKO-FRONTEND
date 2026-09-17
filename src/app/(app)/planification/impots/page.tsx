import type { Metadata } from "next";
import { Landmark } from "lucide-react";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = { title: "Impôts — VOLAKO" };

export default function ImpotsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Impôts</h1>
        <p className="text-sm text-muted-foreground">Suivi de vos obligations fiscales.</p>
      </div>
      <ComingSoon
        icon={Landmark}
        title="Le suivi des impôts arrive bientôt"
        description="Montants, échéances et statut de paiement de vos obligations fiscales, au même endroit."
      />
    </div>
  );
}
