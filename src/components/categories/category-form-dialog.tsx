"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCategoryAction, updateCategoryAction } from "@/actions/categories";
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
import type { Category, TransactionType } from "@/lib/types";

const TYPE_LABELS: Record<TransactionType, string> = {
  INCOME: "Revenu",
  EXPENSE: "Dépense",
};

const schema = z.object({
  name: z.string().trim().min(1, "Le nom de la catégorie est requis."),
  type: z.enum(["INCOME", "EXPENSE"]),
});

type FormValues = z.infer<typeof schema>;

export function CategoryFormDialog({
  category,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  category?: Category;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;
  const router = useRouter();
  const isEdit = Boolean(category);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name ?? "",
      type: category?.type ?? "EXPENSE",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({ name: category?.name ?? "", type: category?.type ?? "EXPENSE" });
    }
  }, [open, category, reset]);

  async function onSubmit(values: FormValues) {
    const result = isEdit && category
      ? await updateCategoryAction(category.id, values)
      : await createCategoryAction(values);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(isEdit ? "Catégorie modifiée." : "Catégorie créée.");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier la catégorie" : "Nouvelle catégorie"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Mettez à jour cette catégorie." : "Créez une catégorie personnalisée pour vos transactions."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="category-name">Nom</Label>
            <Input id="category-name" placeholder="Ex. Santé, Éducation" {...register("name")} />
            <FieldError message={errors.name?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category-type">Type</Label>
            <Select value={watch("type")} onValueChange={(value) => setValue("type", value as TransactionType)}>
              <SelectTrigger id="category-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(TYPE_LABELS) as TransactionType[]).map((type) => (
                  <SelectItem key={type} value={type}>
                    {TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
