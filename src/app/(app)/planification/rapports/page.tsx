import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = { title: "Rapports — VOLAKO" };

export default function RapportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Rapports</h1>
        <p className="text-sm text-muted-foreground">Analyses et exports détaillés de vos finances.</p>
      </div>
      <ComingSoon
        icon={BarChart3}
        title="Les rapports détaillés arrivent bientôt"
        description="Évolution du patrimoine, comparaisons mensuelles et exports — en préparation."
      />
    </div>
  );
}
