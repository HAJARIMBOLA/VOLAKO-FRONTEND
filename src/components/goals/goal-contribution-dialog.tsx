"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addGoalContributionAction } from "@/actions/goals";
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
import type { Account, Goal } from "@/lib/types";

const schema = z.object({
  accountId: z.number({ error: "Le compte est requis." }).int().positive("Le compte est requis."),
  amount: z.number({ error: "Le montant est requis." }).positive("Le montant doit être positif."),
  contributionDate: z.string().min(1, "La date est requise."),
});

type FormValues = z.infer<typeof schema>;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function GoalContributionDialog({
  goal,
  accounts,
  open,
  onOpenChange,
}: {
  goal: Goal;
  accounts: Account[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
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
    defaultValues: { contributionDate: todayIso() },
  });

  React.useEffect(() => {
    if (open) reset({ contributionDate: todayIso() });
  }, [open, reset]);

  async function onSubmit(values: FormValues) {
    const result = await addGoalContributionAction(goal.id, values);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("Contribution ajoutée.");
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alimenter &quot;{goal.name}&quot;</DialogTitle>
          <DialogDescription>
            Suivi indépendant : cette contribution ne modifie pas le solde du compte choisi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="contribution-account">Compte (contexte)</Label>
            <Select value={String(watch("accountId") ?? "")} onValueChange={(v) => setValue("accountId", Number(v))}>
              <SelectTrigger id="contribution-account">
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
            <Label htmlFor="contribution-amount">Montant (Ar)</Label>
            <Input
              id="contribution-amount"
              type="number"
              step="1"
              min="0"
              inputMode="decimal"
              {...register("amount", { valueAsNumber: true })}
            />
            <FieldError message={errors.amount?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contribution-date">Date</Label>
            <Input id="contribution-date" type="date" {...register("contributionDate")} />
            <FieldError message={errors.contributionDate?.message} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement…" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
