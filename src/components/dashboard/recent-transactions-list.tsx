import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatDate, formatSignedAmount } from "@/lib/utils";
import type { Transaction } from "@/lib/types";

export function RecentTransactionsList({ transactions }: { transactions: Transaction[] }) {
  return (
    <ul className="divide-y divide-border">
      {transactions.map((transaction) => {
        const isIncome = transaction.type === "INCOME";
        return (
          <li key={transaction.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                isIncome ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
              }`}
            >
              {isIncome ? <ArrowUpRight className="size-4" /> : <ArrowDownLeft className="size-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {transaction.description || transaction.categoryName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {transaction.categoryName} · {transaction.accountName} · {formatDate(transaction.transactionDate)}
              </p>
            </div>
            <span
              className={`shrink-0 font-mono text-sm font-semibold tabular-nums ${
                isIncome ? "text-success" : "text-danger"
              }`}
            >
              {formatSignedAmount(transaction.amount, transaction.type)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
