import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { getTransactions } from "@/lib/data/transactions";
import { getAccounts } from "@/lib/data/accounts";
import { getCategories } from "@/lib/data/categories";
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

  if (transactions.length === 0) {
    return (
      <EmptyState icon={TrendingUp} title="Aucun revenu enregistré" description="Vos rentrées d'argent apparaîtront ici." />
    );
  }

  return (
    <div className="space-y-4">
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
