import type { Metadata } from "next";
import Link from "next/link";
import { Tags, TrendingUp } from "lucide-react";
import { getTransactions } from "@/lib/data/transactions";
import { getAccounts } from "@/lib/data/accounts";
import { getCategories } from "@/lib/data/categories";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableHeader, TableBody, TableRow, TableHead } from "@/components/ui/table";
import { TransactionRow } from "@/components/transactions/transaction-row";
import { formatAmount } from "@/lib/utils";

export const metadata: Metadata = { title: "Revenus — VOLAKO" };

export default async function AccountsRevenuePage() {
  const [transactions, accounts, categories] = await Promise.all([
    getTransactions({ type: "INCOME" }),
    getAccounts(),
    getCategories(),
  ]);

  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  const header = (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Revenus</h1>
        <p className="text-sm text-muted-foreground">Toutes vos rentrées d&apos;argent.</p>
      </div>
      <Button asChild size="sm" variant="ghost">
        <Link href="/categories">
          <Tags className="size-4" />
          Gérer les catégories
        </Link>
      </Button>
    </div>
  );

  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        {header}
        <EmptyState icon={TrendingUp} title="Aucun revenu enregistré" description="Vos rentrées d'argent apparaîtront ici." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}
      <p className="text-sm text-muted-foreground">
        Total : <span className="font-mono font-semibold text-success">{formatAmount(total)}</span>
      </p>
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
    </div>
  );
}
