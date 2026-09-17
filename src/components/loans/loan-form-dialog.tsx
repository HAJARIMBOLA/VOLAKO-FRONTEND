"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createLoanAction, updateLoanAction } from "@/actions/loans";
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
import type { Loan } from "@/lib/types";

const schema = z.object({
  name: z.string().trim().min(1, "Le nom est requis."),
  principalAmount: z.number({ error: "Le principal est requis." }).positive("Le principal doit être positif."),
  monthlyPayment: z.number({ error: "La mensualité est requise." }).positive("La mensualité doit être positive."),
  durationMonths: z.number({ error: "La durée est requise." }).int().positive("La durée doit être d'au moins 1 mois."),
  startDate: z.string().min(1, "La date de début est requise."),
});

type FormValues = z.infer<typeof schema>;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function LoanFormDialog({
  loan,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  loan?: Loan;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;
  const router = useRouter();
  const isEdit = Boolean(loan);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: loan?.name ?? "",
      principalAmount: loan?.principalAmount ?? undefined,
      monthlyPayment: loan?.monthlyPayment ?? undefined,
      durationMonths: loan?.durationMonths ?? undefined,
      startDate: loan?.startDate ?? todayIso(),
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        name: loan?.name ?? "",
        principalAmount: loan?.principalAmount ?? undefined,
        monthlyPayment: loan?.monthlyPayment ?? undefined,
        durationMonths: loan?.durationMonths ?? undefined,
        startDate: loan?.startDate ?? todayIso(),
      });
    }
  }, [open, loan, reset]);

  async function onSubmit(values: FormValues) {
    const result = isEdit && loan ? await updateLoanAction(loan.id, values) : await createLoanAction(values);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(isEdit ? "Crédit modifié." : "Crédit ajouté.");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier le crédit" : "Nouveau crédit"}</DialogTitle>
          <DialogDescription>
            Un prêt bancaire à rembourser progressivement, mensualité fixe.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="loan-name">Nom du crédit</Label>
            <Input id="loan-name" placeholder="Ex. Prêt auto, Prêt immobilier…" {...register("name")} />
            <FieldError message={errors.name?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="loan-principal">Montant du principal (Ar)</Label>
            <Input
              id="loan-principal"
              type="number"
              step="1"
              min="0"
              inputMode="decimal"
              {...register("principalAmount", { valueAsNumber: true })}
            />
            <FieldError message={errors.principalAmount?.message} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="loan-monthly">Mensualité (Ar)</Label>
              <Input
                id="loan-monthly"
                type="number"
                step="1"
                min="0"
                inputMode="decimal"
                {...register("monthlyPayment", { valueAsNumber: true })}
              />
              <FieldError message={errors.monthlyPayment?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="loan-duration">Durée (mois)</Label>
              <Input
                id="loan-duration"
                type="number"
                step="1"
                min="1"
                inputMode="numeric"
                {...register("durationMonths", { valueAsNumber: true })}
              />
              <FieldError message={errors.durationMonths?.message} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="loan-start-date">Date de début</Label>
            <Input id="loan-start-date" type="date" {...register("startDate")} />
            <FieldError message={errors.startDate?.message} />
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
