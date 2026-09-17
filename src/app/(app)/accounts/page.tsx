import type { Metadata } from "next";
import Link from "next/link";
import { Wallet, Plus, Tags } from "lucide-react";
import { getAccounts } from "@/lib/data/accounts";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { AccountFormDialog } from "@/components/accounts/account-form-dialog";
import { AccountCard } from "@/components/accounts/account-card";
import { ACCOUNT_TYPE_LABELS } from "@/lib/labels";
import type { Account, AccountType } from "@/lib/types";

export const metadata: Metadata = { title: "Comptes — VOLAKO" };

const TYPE_ORDER: AccountType[] = ["CASH", "BANK", "MOBILE_MONEY"];

export default async function AccountsPage() {
  const accounts = await getAccounts();

  const grouped = TYPE_ORDER.map((type) => ({
    type,
    accounts: accounts.filter((a) => a.type === type),
  })).filter((group) => group.accounts.length > 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button asChild size="sm" variant="ghost">
          <Link href="/categories">
            <Tags className="size-4" />
            Gérer les catégories
          </Link>
        </Button>
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

      {grouped.length > 0 ? (
        grouped.map((group) => (
          <section key={group.type} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {ACCOUNT_TYPE_LABELS[group.type]}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.accounts.map((account: Account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          </section>
        ))
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
