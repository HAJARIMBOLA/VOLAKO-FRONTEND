import type { Metadata } from "next";
import { Wallet, Plus } from "lucide-react";
import { getAccounts } from "@/lib/data/accounts";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { AccountFormDialog } from "@/components/accounts/account-form-dialog";
import { AccountCard } from "@/components/accounts/account-card";

export const metadata: Metadata = { title: "Comptes — VOLAKO" };

export default async function AccountsPage() {
  const accounts = await getAccounts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Mes comptes</h1>
          <p className="text-sm text-muted-foreground">Cash, banque, mobile money — tout au même endroit.</p>
        </div>
        <AccountFormDialog
          trigger={
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4" />
                Nouveau compte
              </Button>
            </DialogTrigger>
          }
        />
      </div>

      {accounts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Wallet}
          title="Aucun compte pour l'instant"
          description="Créez votre premier compte pour commencer à suivre vos finances."
        />
      )}
    </div>
  );
}
