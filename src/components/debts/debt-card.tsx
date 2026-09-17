"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreVertical, Pencil, Trash2, HandCoins } from "lucide-react";
import { deleteDebtAction } from "@/actions/debts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DebtFormDialog } from "./debt-form-dialog";
import { DebtPaymentDialog } from "./debt-payment-dialog";
import { formatAmount, formatDate } from "@/lib/utils";
import type { Account, Debt, DebtStatus } from "@/lib/types";

const STATUS_LABELS: Record<DebtStatus, string> = {
  OPEN: "Ouvert",
  PARTIALLY_PAID: "Partiellement remboursé",
  PAID: "Soldé",
};

export function DebtCard({ debt, accounts }: { debt: Debt; accounts: Account[] }) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const router = useRouter();

  const progress = debt.amount > 0 ? Math.min(100, Math.round((debt.paidAmount / debt.amount) * 100)) : 0;

  async function handleDelete() {
    setPending(true);
    const result = await deleteDebtAction(debt.id);
    setPending(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("Supprimé.");
    setConfirmOpen(false);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-foreground">{debt.personName}</p>
              <Badge variant={debt.status === "PAID" ? "success" : debt.overdue ? "danger" : "neutral"}>
                {debt.overdue && debt.status !== "PAID" ? "En retard" : STATUS_LABELS[debt.status]}
              </Badge>
            </div>
            {debt.description ? <p className="mt-0.5 text-sm text-muted-foreground">{debt.description}</p> : null}
            {debt.dueDate ? (
              <p className="mt-0.5 text-xs text-muted-foreground">Échéance : {formatDate(debt.dueDate)}</p>
            ) : null}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Actions pour ${debt.personName}`}>
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {debt.status !== "PAID" ? (
                <DropdownMenuItem onSelect={() => setPaymentOpen(true)}>
                  <HandCoins className="size-4" />
                  Enregistrer un remboursement
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                <Pencil className="size-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setConfirmOpen(true)} className="text-danger">
                <Trash2 className="size-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {formatAmount(debt.paidAmount)} / {formatAmount(debt.amount)}
            </span>
            <span className="font-mono font-medium text-foreground">{formatAmount(debt.remainingAmount)} restant</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={debt.status === "PAID" ? "h-full rounded-full bg-success" : "h-full rounded-full bg-primary"}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>

      <DebtFormDialog direction={debt.direction} debt={debt} open={editOpen} onOpenChange={setEditOpen} />
      <DebtPaymentDialog debt={debt} accounts={accounts} open={paymentOpen} onOpenChange={setPaymentOpen} />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Supprimer cet enregistrement ?"
        description={`L'historique de "${debt.personName}" sera définitivement supprimé.`}
        confirmLabel="Supprimer"
        destructive
        pending={pending}
        onConfirm={handleDelete}
      />
    </Card>
  );
}
