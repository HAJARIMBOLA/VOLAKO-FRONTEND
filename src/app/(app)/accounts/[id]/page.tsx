import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowLeftRight, Banknote, Building2, Plus, Smartphone } from "lucide-react";
import { getAccounts } from "@/lib/data/accounts";
import { getTransactions } from "@/lib/data/transactions";
import { getCategories } from "@/lib/data/categories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableHeader, TableBody, TableRow, TableHead } from "@/components/ui/table";
import { TransactionFormDialog } from "@/components/transactions/transaction-form-dialog";
import { TransactionRow } from "@/components/transactions/transaction-row";
import { ACCOUNT_TYPE_LABELS } from "@/lib/labels";
import { cn, formatAmount } from "@/lib/utils";
import type { AccountType } from "@/lib/types";

export const metadata: Metadata = { title: "Compte — VOLAKO" };

const TYPE_ICON: Record<AccountType, React.ElementType> = {
  CASH: Banknote,
  BANK: Building2,
  MOBILE_MONEY: Smartphone,
};

const TYPE_BACK_HREF: Record<AccountType, string> = {
  CASH: "/accounts",
  BANK: "/accounts/banque",
  MOBILE_MONEY: "/accounts/mobile-money",
};

export default async function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const accountId = Number(id);

  const [accounts, categories] = await Promise.all([getAccounts(), getCategories()]);
  const account = accounts.find((a) => a.id === accountId);

  if (!account) {
    notFound();
  }

  const transactions = await getTransactions({ accountId });
  const Icon = TYPE_ICON[account.type];

  return (
    <div className="space-y-6">
      <Link
        href={TYPE_BACK_HREF[account.type]}
        className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Retour à {ACCOUNT_TYPE_LABELS[account.type]}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
            <Icon className="size-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground">{account.name}</h1>
              {!account.active ? <Badge variant="neutral">Archivé</Badge> : null}
              {!account.allowNegativeBalance ? <Badge variant="primary">Solde protégé</Badge> : null}
            </div>
            {account.accountNumber ? (
              <p className="text-sm text-muted-foreground">{account.accountNumber}</p>
            ) : null}
            <p
              className={cn(
                "mt-1 font-mono text-2xl font-semibold tabular-nums",
                account.balance < 0 ? "text-danger" : "text-foreground"
              )}
            >
              {formatAmount(account.balance)}
            </p>
          </div>
        </div>

        {account.active ? (
          <TransactionFormDialog
            accounts={accounts}
            categories={categories}
            defaultAccountId={account.id}
            trigger={
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="size-4" />
                  Nouvelle transaction
                </Button>
              </DialogTrigger>
            }
          />
        ) : null}
      </div>

      {transactions.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Compte</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} accounts={accounts} categories={categories} />
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          icon={ArrowLeftRight}
          title="Aucune transaction sur ce compte"
          description="Ajoutez la première transaction de ce compte."
        />
      )}
    </div>
  );
}
