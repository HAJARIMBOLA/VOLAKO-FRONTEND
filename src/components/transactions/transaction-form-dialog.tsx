"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createTransactionAction, updateTransactionAction } from "@/actions/transactions";
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
import { CategoryCombobox } from "./category-combobox";
import { cn } from "@/lib/utils";
import type { Account, Category, Transaction, TransactionType } from "@/lib/types";

const schema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number({ error: "Le montant est requis." }).positive("Le montant doit être positif."),
  accountId: z.number({ error: "Le compte est requis." }).int().positive("Le compte est requis."),
  categoryId: z.number({ error: "La catégorie est requise." }).int().positive("La catégorie est requise."),
  description: z.string().trim().max(255).optional(),
  transactionDate: z.string().min(1, "La date est requise."),
});

type FormValues = z.infer<typeof schema>;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function TransactionFormDialog({
  transaction,
  accounts,
  categories,
  defaultAccountId,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  transaction?: Transaction;
  accounts: Account[];
  categories: Category[];
  defaultAccountId?: number;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;
  const router = useRouter();
  const isEdit = Boolean(transaction);

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
      type: transaction?.type ?? "EXPENSE",
      amount: transaction?.amount ?? undefined,
      accountId: transaction?.accountId ?? defaultAccountId,
      categoryId: transaction?.categoryId,
      description: transaction?.description ?? "",
      transactionDate: transaction?.transactionDate ?? todayIso(),
    },
  });

  const [localCategories, setLocalCategories] = React.useState<Category[]>(categories);

  React.useEffect(() => {
    if (open) setLocalCategories(categories);
  }, [open, categories]);

  const type = watch("type");
  const activeAccounts = accounts.filter((a) => a.active || a.id === transaction?.accountId);
  const matchingCategories = localCategories.filter(
    (c) => c.type === type && (c.active || c.id === transaction?.categoryId)
  );

  React.useEffect(() => {
    if (open) {
      reset({
        type: transaction?.type ?? "EXPENSE",
        amount: transaction?.amount ?? undefined,
        accountId: transaction?.accountId ?? defaultAccountId,
        categoryId: transaction?.categoryId,
        description: transaction?.description ?? "",
        transactionDate: transaction?.transactionDate ?? todayIso(),
      });
    }
  }, [open, transaction, defaultAccountId, reset]);

  async function onSubmit(values: FormValues) {
    const payload = { ...values, description: values.description || undefined };
    const result = isEdit && transaction
      ? await updateTransactionAction(transaction.id, payload)
      : await createTransactionAction(payload);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(isEdit ? "Transaction modifiée." : "Transaction ajoutée.");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier la transaction" : "Nouvelle transaction"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Mettez à jour cette transaction." : "Enregistrez un revenu ou une dépense."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-2">
            {(["EXPENSE", "INCOME"] as TransactionType[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setValue("type", option);
                  setValue("categoryId", undefined as unknown as number);
                }}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  type === option
                    ? option === "INCOME"
                      ? "border-success/40 bg-success/10 text-success"
                      : "border-danger/40 bg-danger/10 text-danger"
                    : "border-border-strong bg-surface text-muted-foreground hover:text-foreground"
                )}
              >
                {option === "INCOME" ? "Revenu" : "Dépense"}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tx-amount">Montant (Ar)</Label>
            <Input
              id="tx-amount"
              type="number"
              step="1"
              min="0"
              inputMode="decimal"
              {...register("amount", { valueAsNumber: true })}
            />
            <FieldError message={errors.amount?.message} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tx-account">Compte</Label>
              <Select value={String(watch("accountId") ?? "")} onValueChange={(v) => setValue("accountId", Number(v))}>
                <SelectTrigger id="tx-account">
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
              <Label htmlFor="tx-category">Catégorie</Label>
              <CategoryCombobox
                key={`${transaction?.id ?? "new"}-${type}`}
                type={type}
                categories={matchingCategories}
                value={watch("categoryId")}
                onChange={(categoryId) => setValue("categoryId", categoryId)}
                onCategoryCreated={(category) => setLocalCategories((prev) => [...prev, category])}
              />
              <FieldError message={errors.categoryId?.message} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tx-date">Date</Label>
            <Input id="tx-date" type="date" {...register("transactionDate")} />
            <FieldError message={errors.transactionDate?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tx-description">Description (optionnel)</Label>
            <Input id="tx-description" placeholder="Ex. Restaurant, Loyer…" {...register("description")} />
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
