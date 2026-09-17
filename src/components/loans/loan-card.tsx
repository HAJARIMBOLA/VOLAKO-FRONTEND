"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreVertical, Pencil, Trash2, CreditCard } from "lucide-react";
import { deleteLoanAction } from "@/actions/loans";
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
import { LoanFormDialog } from "./loan-form-dialog";
import { LoanPaymentDialog } from "./loan-payment-dialog";
import { formatAmount, formatDate } from "@/lib/utils";
import type { Account, Loan } from "@/lib/types";

export function LoanCard({ loan, accounts }: { loan: Loan; accounts: Account[] }) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const router = useRouter();

  const progress =
    loan.principalAmount > 0 ? Math.min(100, Math.round((loan.paidAmount / loan.principalAmount) * 100)) : 0;

  async function handleDelete() {
    setPending(true);
    const result = await deleteLoanAction(loan.id);
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
              <p className="font-medium text-foreground">{loan.name}</p>
              <Badge variant={loan.completed ? "success" : "neutral"}>
                {loan.completed ? "Remboursé" : `${loan.paidInstallments}/${loan.durationMonths} mensualités`}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Mensualité : {formatAmount(loan.monthlyPayment)} · Début : {formatDate(loan.startDate)}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Actions pour ${loan.name}`}>
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!loan.completed ? (
                <DropdownMenuItem onSelect={() => setPaymentOpen(true)}>
                  <CreditCard className="size-4" />
                  Enregistrer une mensualité
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
              {formatAmount(loan.paidAmount)} / {formatAmount(loan.principalAmount)}
            </span>
            <span className="font-mono font-medium text-foreground">{formatAmount(loan.remainingAmount)} restant</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={loan.completed ? "h-full rounded-full bg-success" : "h-full rounded-full bg-primary"}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>

      <LoanFormDialog loan={loan} open={editOpen} onOpenChange={setEditOpen} />
      <LoanPaymentDialog loan={loan} accounts={accounts} open={paymentOpen} onOpenChange={setPaymentOpen} />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Supprimer ce crédit ?"
        description={`L'historique de « ${loan.name} » sera définitivement supprimé.`}
        confirmLabel="Supprimer"
        destructive
        pending={pending}
        onConfirm={handleDelete}
      />
    </Card>
  );
}
