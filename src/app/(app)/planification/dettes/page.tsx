import type { Metadata } from "next";
import { HandCoins, Plus } from "lucide-react";
import { getDebts } from "@/lib/data/debts";
import { getAccounts } from "@/lib/data/accounts";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { DebtFormDialog } from "@/components/debts/debt-form-dialog";
import { DebtCard } from "@/components/debts/debt-card";

export const metadata: Metadata = { title: "Dettes — VOLAKO" };

export default async function DettesPage() {
  const [debts, accounts] = await Promise.all([getDebts("PAYABLE"), getAccounts()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Dettes</h1>
          <p className="text-sm text-muted-foreground">Ce que vous devez à d&apos;autres personnes.</p>
        </div>
        <DebtFormDialog
          direction="PAYABLE"
          trigger={
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4" />
                Nouvelle dette
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
        <EmptyState icon={HandCoins} title="Aucune dette" description="Vous ne devez rien à personne pour l'instant." />
      )}
    </div>
  );
}
