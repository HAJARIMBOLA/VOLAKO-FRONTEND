"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createGoalAction, updateGoalAction } from "@/actions/goals";
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
import type { Goal } from "@/lib/types";

const schema = z.object({
  name: z.string().trim().min(1, "Le nom du fonds est requis."),
  targetAmount: z.number({ error: "Le montant cible est requis." }).positive("Le montant doit être positif."),
  targetDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function GoalFormDialog({
  goal,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  goal?: Goal;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;
  const router = useRouter();
  const isEdit = Boolean(goal);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: goal?.name ?? "",
      targetAmount: goal?.targetAmount ?? undefined,
      targetDate: goal?.targetDate ?? "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({ name: goal?.name ?? "", targetAmount: goal?.targetAmount ?? undefined, targetDate: goal?.targetDate ?? "" });
    }
  }, [open, goal, reset]);

  async function onSubmit(values: FormValues) {
    const payload = { ...values, targetDate: values.targetDate || undefined };
    const result = isEdit && goal ? await updateGoalAction(goal.id, payload) : await createGoalAction(payload);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(isEdit ? "Fonds modifié." : "Fonds créé.");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier le fonds" : "Nouveau fonds"}</DialogTitle>
          <DialogDescription>Un objectif d&apos;épargne à suivre au fil du temps.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="goal-name">Nom</Label>
            <Input id="goal-name" placeholder="Ex. MacBook, Fonds d'urgence…" {...register("name")} />
            <FieldError message={errors.name?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="goal-target">Montant cible (Ar)</Label>
            <Input
              id="goal-target"
              type="number"
              step="1"
              min="0"
              inputMode="decimal"
              {...register("targetAmount", { valueAsNumber: true })}
            />
            <FieldError message={errors.targetAmount?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="goal-date">Date cible (optionnel)</Label>
            <Input id="goal-date" type="date" {...register("targetDate")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement…" : isEdit ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
