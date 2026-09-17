import type { Metadata } from "next";
import { CreditCard, Plus } from "lucide-react";
import { getLoans } from "@/lib/data/loans";
import { getAccounts } from "@/lib/data/accounts";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { LoanFormDialog } from "@/components/loans/loan-form-dialog";
import { LoanCard } from "@/components/loans/loan-card";

export const metadata: Metadata = { title: "Crédits — VOLAKO" };

export default async function CreditsPage() {
  const [loans, accounts] = await Promise.all([getLoans(), getAccounts()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Crédits</h1>
          <p className="text-sm text-muted-foreground">Vos prêts bancaires, remboursés petit à petit.</p>
        </div>
        <LoanFormDialog
          trigger={
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4" />
                Nouveau crédit
              </Button>
            </DialogTrigger>
          }
        />
      </div>

      {loans.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {loans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} accounts={accounts} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CreditCard}
          title="Aucun crédit"
          description="Ajoutez votre premier prêt bancaire pour suivre son remboursement."
        />
      )}
    </div>
  );
}
