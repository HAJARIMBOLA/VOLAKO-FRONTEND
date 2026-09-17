"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { formatAmount } from "@/lib/utils";
import type { Debt } from "@/lib/types";

export function OverdueDebtsAlert({ debts }: { debts: Debt[] }) {
  const receivable = debts.filter((d) => d.direction === "RECEIVABLE");
  const payable = debts.filter((d) => d.direction === "PAYABLE");

  React.useEffect(() => {
    if (debts.length === 0) return;
    if (receivable.length > 0) {
      toast.warning(
        `${receivable.length} créance${receivable.length > 1 ? "s" : ""} en retard — on vous doit encore de l'argent.`
      );
    }
    if (payable.length > 0) {
      toast.warning(
        `${payable.length} dette${payable.length > 1 ? "s" : ""} en retard — vous devez encore de l'argent.`
      );
    }
    // Fire once per mount (page load), not on every re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (debts.length === 0) return null;

  return (
    <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-medium text-foreground">Paiements en retard</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {receivable.map((debt) => (
              <li key={debt.id}>
                <Link href="/planification/creances" className="hover:underline">
                  <span className="text-foreground">{debt.personName}</span> vous doit encore{" "}
                  <span className="font-mono font-medium text-warning">{formatAmount(debt.remainingAmount)}</span>
                </Link>
              </li>
            ))}
            {payable.map((debt) => (
              <li key={debt.id}>
                <Link href="/planification/dettes" className="hover:underline">
                  Vous devez encore <span className="font-mono font-medium text-warning">{formatAmount(debt.remainingAmount)}</span> à{" "}
                  <span className="text-foreground">{debt.personName}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
