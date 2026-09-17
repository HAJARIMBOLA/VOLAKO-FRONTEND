import type { Metadata } from "next";
import { HandHeart, Plus } from "lucide-react";
import { getDebts } from "@/lib/data/debts";
import { getAccounts } from "@/lib/data/accounts";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { DebtFormDialog } from "@/components/debts/debt-form-dialog";
import { DebtCard } from "@/components/debts/debt-card";

export const metadata: Metadata = { title: "Créances — VOLAKO" };

export default async function CreancesPage() {
  const [debts, accounts] = await Promise.all([getDebts("RECEIVABLE"), getAccounts()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Créances</h1>
          <p className="text-sm text-muted-foreground">Ce que d&apos;autres personnes vous doivent.</p>
        </div>
        <DebtFormDialog
          direction="RECEIVABLE"
          trigger={
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4" />
                Nouvelle créance
              </Button>
            </DialogTrigger>
          }
        />
      </div>

      {debts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {debts.map((debt) => (
            <DebtCard key={debt.id} debt={debt} accounts={accounts} />
          ))}
        </div>
      ) : (
        <EmptyState icon={HandHeart} title="Aucune créance" description="Personne ne vous doit d'argent pour l'instant." />
      )}
    </div>
  );
}
