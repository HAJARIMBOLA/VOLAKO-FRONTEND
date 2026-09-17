import type { Metadata } from "next";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { getTransactions } from "@/lib/data/transactions";
import { EmptyState } from "@/components/ui/empty-state";
import { History } from "lucide-react";
import { cn, formatDate, formatSignedAmount } from "@/lib/utils";

export const metadata: Metadata = { title: "Chronologie — VOLAKO" };

export default async function TimelinePage() {
  const transactions = await getTransactions();

  const header = (
    <div>
      <h1 className="text-xl font-semibold text-foreground">Chronologie</h1>
      <p className="text-sm text-muted-foreground">Vos transactions classées par date.</p>
    </div>
  );

  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        {header}
        <EmptyState
          icon={History}
          title="Aucun événement pour l'instant"
          description="Vos transactions apparaîtront ici, classées par date."
        />
      </div>
    );
  }

  const groups = new Map<string, typeof transactions>();
  for (const t of transactions) {
    const list = groups.get(t.transactionDate) ?? [];
    list.push(t);
    groups.set(t.transactionDate, list);
  }
  const orderedDates = Array.from(groups.keys()).sort((a, b) => (a < b ? 1 : -1));

  return (
    <div className="space-y-6">
      {header}
      <div className="space-y-8">
      {orderedDates.map((date) => (
        <div key={date} className="relative pl-6">
          <div className="absolute left-0 top-1 flex h-full flex-col items-center">
            <span className="size-2.5 rounded-full bg-primary" />
            <span className="mt-1 w-px flex-1 bg-border" />
          </div>
          <p className="mb-3 text-sm font-semibold text-foreground">{formatDate(date)}</p>
          <ul className="space-y-3">
            {groups.get(date)!.map((t) => {
              const isIncome = t.type === "INCOME";
              return (
                <li key={t.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      isIncome ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                    )}
                  >
                    {isIncome ? <ArrowUpRight className="size-4" /> : <ArrowDownLeft className="size-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{t.description || t.categoryName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.categoryName} · {t.accountName}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 font-mono text-sm font-semibold tabular-nums",
                      isIncome ? "text-success" : "text-danger"
                    )}
                  >
                    {formatSignedAmount(t.amount, t.type)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      </div>
    </div>
  );
}
