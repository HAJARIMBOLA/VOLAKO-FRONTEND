import { Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getAccounts } from "@/lib/data/accounts";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { AccountFormDialog } from "@/components/accounts/account-form-dialog";
import { AccountCard } from "@/components/accounts/account-card";
import { ACCOUNT_TYPE_LABELS } from "@/lib/labels";
import type { AccountType } from "@/lib/types";

export async function AccountTypeSection({
  type,
  icon: Icon,
  title,
  description,
  emptyDescription,
}: {
  type: AccountType;
  icon: LucideIcon;
  title: string;
  description: string;
  emptyDescription: string;
}) {
  const accounts = await getAccounts();
  const filtered = accounts.filter((a) => a.type === type);
  const label = ACCOUNT_TYPE_LABELS[type];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <AccountFormDialog
          defaultType={type}
          trigger={
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4" />
                Nouveau compte {label.toLowerCase()}
              </Button>
            </DialogTrigger>
          }
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Icon} title={`Aucun compte ${label.toLowerCase()}`} description={emptyDescription} />
      )}
    </div>
  );
}
