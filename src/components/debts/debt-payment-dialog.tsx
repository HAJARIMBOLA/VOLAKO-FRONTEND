"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addDebtPaymentAction } from "@/actions/debts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldError } from "@/components/ui/field-error";
import type { Account, Debt } from "@/lib/types";

const schema = z.object({
  accountId: z.number({ error: "Le compte est requis." }).int().positive("Le compte est requis."),
  amount: z.number({ error: "Le montant est requis." }).positive("Le montant doit être positif."),
  paymentDate: z.string().min(1, "La date est requise."),
});

type FormValues = z.infer<typeof schema>;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function DebtPaymentDialog({
  debt,
  accounts,
  open,
  onOpenChange,
}: {
  debt: Debt;
  accounts: Account[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const isReceivable = debt.direction === "RECEIVABLE";
  const activeAccounts = accounts.filter((a) => a.active);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: debt.remainingAmount, paymentDate: todayIso() },
  });

  React.useEffect(() => {
    if (open) {
      reset({ amount: debt.remainingAmount, paymentDate: todayIso() });
    }
  }, [open, debt, reset]);

  async function onSubmit(values: FormValues) {
    const result = await addDebtPaymentAction(debt.id, values);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("Remboursement enregistré.");
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enregistrer un remboursement</DialogTitle>
          <DialogDescription>
            {isReceivable
              ? `${debt.personName} vous rembourse — le compte choisi sera crédité.`
              : `Vous remboursez ${debt.personName} — le compte choisi sera débité.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="payment-account">Compte</Label>
            <Select value={String(watch("accountId") ?? "")} onValueChange={(v) => setValue("accountId", Number(v))}>
              <SelectTrigger id="payment-account">
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent>
                {activeAccounts.map((account) => (
                  <SelectItem key={account.id} value={String(account.id)}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.accountId?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payment-amount">Montant (Ar)</Label>
            <Input
              id="payment-amount"
              type="number"
              step="1"
              min="0"
              inputMode="decimal"
              {...register("amount", { valueAsNumber: true })}
            />
            <FieldError message={errors.amount?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payment-date">Date</Label>
            <Input id="payment-date" type="date" {...register("paymentDate")} />
            <FieldError message={errors.paymentDate?.message} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement…" : "Confirmer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
