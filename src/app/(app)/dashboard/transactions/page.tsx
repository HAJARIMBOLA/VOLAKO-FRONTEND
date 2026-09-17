import type { Metadata } from "next";
import { ArrowLeftRight, Plus } from "lucide-react";
import { getTransactions } from "@/lib/data/transactions";
import { getAccounts } from "@/lib/data/accounts";
import { getCategories } from "@/lib/data/categories";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableHeader, TableBody, TableRow, TableHead } from "@/components/ui/table";
import { TransactionFormDialog } from "@/components/transactions/transaction-form-dialog";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionRow } from "@/components/transactions/transaction-row";
import type { TransactionType } from "@/lib/types";

export const metadata: Metadata = { title: "Transactions — VOLAKO" };

interface TransactionsSearchParams {
  accountId?: string;
  categoryId?: string;
  type?: string;
  from?: string;
  to?: string;
}

export default async function DashboardTransactionsPage({
  searchParams,
}: {
  searchParams: Promise<TransactionsSearchParams>;
}) {
  const params = await searchParams;
  const type = params.type === "INCOME" || params.type === "EXPENSE" ? (params.type as TransactionType) : undefined;

  const [accounts, categories, transactions] = await Promise.all([
    getAccounts(),
    getCategories(),
    getTransactions({
      accountId: params.accountId ? Number(params.accountId) : undefined,
      categoryId: params.categoryId ? Number(params.categoryId) : undefined,
      type,
      from: params.from || undefined,
      to: params.to || undefined,
    }),
  ]);

  const hasAccounts = accounts.some((a) => a.active);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground">Vos revenus et dépenses, filtrables par compte, catégorie et période.</p>
        </div>
        <TransactionFormDialog
          accounts={accounts}
          categories={categories}
          trigger={
            <DialogTrigger asChild>
              <Button size="sm" disabled={!hasAccounts}>
                <Plus className="size-4" />
                Nouvelle transaction
              </Button>
            </DialogTrigger>
          }
        />
      </div>

      {!hasAccounts ? (
        <p className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
          Créez d&apos;abord un compte pour pouvoir enregistrer des transactions.
        </p>
      ) : null}

      <TransactionFilters accounts={accounts} categories={categories} />

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
          title="Aucune transaction"
          description="Ajustez les filtres ou ajoutez votre première transaction."
        />
      )}
    </div>
  );
}
