import type { Metadata } from "next";
import Link from "next/link";
import { Wallet, TrendingUp, TrendingDown, ArrowRight, Plus, HandCoins, HandHeart } from "lucide-react";
import { getDashboard } from "@/lib/data/dashboard";
import { getAccounts } from "@/lib/data/accounts";
import { getTransactions } from "@/lib/data/transactions";
import { getDebts, getOverdueDebts } from "@/lib/data/debts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { CategoryBarList } from "@/components/dashboard/category-bar-list";
import { RecentTransactionsList } from "@/components/dashboard/recent-transactions-list";
import { OverdueDebtsAlert } from "@/components/dashboard/overdue-debts-alert";
import { EmptyState } from "@/components/ui/empty-state";
import { formatAmount, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Bilan — VOLAKO" };

export default async function DashboardPage() {
  const [dashboard, accounts, transactions, overdueDebts, debts] = await Promise.all([
    getDashboard(),
    getAccounts(),
    getTransactions(),
    getOverdueDebts(),
    getDebts(),
  ]);

  const receivables = debts.filter((d) => d.direction === "RECEIVABLE" && d.status !== "PAID");
  const payables = debts.filter((d) => d.direction === "PAYABLE" && d.status !== "PAID");
  const totalReceivable = receivables.reduce((sum, d) => sum + d.remainingAmount, 0);
  const totalPayable = payables.reduce((sum, d) => sum + d.remainingAmount, 0);

  const periodTransactions = transactions.filter(
    (t) => t.transactionDate >= dashboard.periodFrom && t.transactionDate <= dashboard.periodTo
  );

  const expenseTotals = new Map<number, { categoryName: string; total: number }>();
  for (const t of periodTransactions) {
    if (t.type !== "EXPENSE") continue;
    const entry = expenseTotals.get(t.categoryId) ?? { categoryName: t.categoryName, total: 0 };
    entry.total += t.amount;
    expenseTotals.set(t.categoryId, entry);
  }
  const categoryBreakdown = Array.from(expenseTotals.entries())
    .map(([categoryId, value]) => ({ categoryId, ...value }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  const recentTransactions = transactions.slice(0, 5);

  const activeAccounts = accounts.filter((a) => a.active && a.balance !== 0);
  const accountShares = activeAccounts
    .map((a) => ({ categoryId: a.id, categoryName: a.name, total: Math.max(a.balance, 0) }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Bilan</h1>
        <p className="text-sm text-muted-foreground">Vue d&apos;ensemble de vos finances.</p>
      </div>

      <OverdueDebtsAlert debts={overdueDebts} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Période du {formatDate(dashboard.periodFrom)} au {formatDate(dashboard.periodTo)}
        </p>
        <Button asChild size="sm">
          <Link href="/dashboard/transactions">
            <Plus className="size-4" />
            Nouvelle transaction
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Solde total" value={formatAmount(dashboard.totalBalance)} icon={Wallet} tone="primary" />
        <StatCard label="Revenus (période)" value={formatAmount(dashboard.totalIncome)} icon={TrendingUp} tone="success" />
        <StatCard label="Dépenses (période)" value={formatAmount(dashboard.totalExpense)} icon={TrendingDown} tone="danger" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold text-foreground">Transactions récentes</CardTitle>
            <Link href="/dashboard/transactions" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Tout voir <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <RecentTransactionsList transactions={recentTransactions} />
            ) : (
              <EmptyState
                icon={Wallet}
                title="Aucune transaction pour l'instant"
                description="Ajoutez votre première transaction pour voir vos mouvements ici."
                action={
                  <Button asChild size="sm" variant="secondary">
                    <Link href="/dashboard/transactions">Ajouter une transaction</Link>
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Dépenses par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.length > 0 ? (
              <CategoryBarList items={categoryBreakdown} />
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Pas encore de dépense sur cette période.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold text-foreground">Créances</CardTitle>
            <Link href="/planification/creances" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Tout voir <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {receivables.length > 0 ? (
              <div className="space-y-3">
                <p className="text-2xl font-semibold text-success">{formatAmount(totalReceivable)}</p>
                <p className="text-xs text-muted-foreground">
                  {receivables.length} personne{receivables.length > 1 ? "s" : ""} vous doi{receivables.length > 1 ? "vent" : "t"} de l&apos;argent
                </p>
              </div>
            ) : (
              <EmptyState
                icon={HandHeart}
                title="Aucune créance"
                description="Personne ne vous doit d'argent pour l'instant."
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold text-foreground">Dettes</CardTitle>
            <Link href="/planification/dettes" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Tout voir <ArrowRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {payables.length > 0 ? (
              <div className="space-y-3">
                <p className="text-2xl font-semibold text-danger">{formatAmount(totalPayable)}</p>
                <p className="text-xs text-muted-foreground">
                  Vous devez de l&apos;argent à {payables.length} personne{payables.length > 1 ? "s" : ""}
                </p>
              </div>
            ) : (
              <EmptyState
                icon={HandCoins}
                title="Aucune dette"
                description="Vous ne devez d'argent à personne pour l'instant."
              />
            )}
          </CardContent>
        </Card>
      </div>

      {accountShares.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Où est mon argent ?</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryBarList items={accountShares} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
