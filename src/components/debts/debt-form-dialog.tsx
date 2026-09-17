"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createDebtAction, updateDebtAction } from "@/actions/debts";
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
import { FieldError } from "@/components/ui/field-error";
import type { Debt, DebtDirection } from "@/lib/types";

const schema = z.object({
  personName: z.string().trim().min(1, "Le nom est requis."),
  amount: z.number({ error: "Le montant est requis." }).positive("Le montant doit être positif."),
  description: z.string().trim().max(255).optional(),
  dueDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function DebtFormDialog({
  direction,
  debt,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  direction: DebtDirection;
  debt?: Debt;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;
  const router = useRouter();
  const isEdit = Boolean(debt);
  const isReceivable = direction === "RECEIVABLE";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      personName: debt?.personName ?? "",
      amount: debt?.amount ?? undefined,
      description: debt?.description ?? "",
      dueDate: debt?.dueDate ?? "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        personName: debt?.personName ?? "",
        amount: debt?.amount ?? undefined,
        description: debt?.description ?? "",
        dueDate: debt?.dueDate ?? "",
      });
    }
  }, [open, debt, reset]);

  async function onSubmit(values: FormValues) {
    const payload = { direction, ...values, description: values.description || undefined, dueDate: values.dueDate || undefined };
    const result = isEdit && debt ? await updateDebtAction(debt.id, payload) : await createDebtAction(payload);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(isEdit ? "Modifié." : isReceivable ? "Créance ajoutée." : "Dette ajoutée.");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier" : isReceivable ? "Nouvelle créance" : "Nouvelle dette"}
          </DialogTitle>
          <DialogDescription>
            {isReceivable
              ? "Enregistrez une somme que quelqu'un vous doit."
              : "Enregistrez une somme que vous devez à quelqu'un."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="debt-person">{isReceivable ? "Qui vous doit ?" : "À qui devez-vous ?"}</Label>
            <Input id="debt-person" placeholder="Ex. Jean, Marc…" {...register("personName")} />
            <FieldError message={errors.personName?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="debt-amount">Montant (Ar)</Label>
            <Input
              id="debt-amount"
              type="number"
              step="1"
              min="0"
              inputMode="decimal"
              {...register("amount", { valueAsNumber: true })}
            />
            <FieldError message={errors.amount?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="debt-due-date">Échéance (optionnel)</Label>
            <Input id="debt-due-date" type="date" {...register("dueDate")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="debt-description">Description (optionnel)</Label>
            <Input id="debt-description" placeholder="Contexte, motif…" {...register("description")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement…" : isEdit ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
