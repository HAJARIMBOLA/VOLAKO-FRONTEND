"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAccountAction, updateAccountAction } from "@/actions/accounts";
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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldError } from "@/components/ui/field-error";
import { ACCOUNT_TYPE_LABELS } from "@/lib/labels";
import type { Account, AccountType } from "@/lib/types";

const schema = z.object({
  name: z.string().trim().min(1, "Le nom du compte est requis."),
  type: z.enum(["CASH", "BANK", "MOBILE_MONEY"]),
  allowNegativeBalance: z.boolean(),
  accountNumber: z.string().trim().max(50, "Le numéro est trop long").optional(),
});

type FormValues = z.infer<typeof schema>;

const NAME_PLACEHOLDERS: Record<AccountType, string> = {
  CASH: "Ex. Espèces, Petite caisse",
  BANK: "Ex. BNI Courant, BOA Épargne",
  MOBILE_MONEY: "Ex. MVola, Airtel Money",
};

const NAME_HINTS: Record<AccountType, string> = {
  CASH: "Créez plusieurs comptes cash si vous gérez plusieurs caisses.",
  BANK: "Vous pouvez ajouter un compte par banque, ou plusieurs comptes dans la même banque.",
  MOBILE_MONEY: "Vous pouvez ajouter un compte par numéro (MVola, Airtel Money…).",
};

const NUMBER_LABELS: Partial<Record<AccountType, string>> = {
  BANK: "Numéro de compte",
  MOBILE_MONEY: "Numéro de téléphone",
};

const NUMBER_PLACEHOLDERS: Partial<Record<AccountType, string>> = {
  BANK: "Ex. 0012345678",
  MOBILE_MONEY: "Ex. 034 00 000 00",
};

export function AccountFormDialog({
  account,
  defaultType = "CASH",
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  account?: Account;
  defaultType?: AccountType;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;
  const router = useRouter();
  const isEdit = Boolean(account);

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
      name: account?.name ?? "",
      type: account?.type ?? defaultType,
      allowNegativeBalance: account?.allowNegativeBalance ?? true,
      accountNumber: account?.accountNumber ?? "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        name: account?.name ?? "",
        type: account?.type ?? defaultType,
        allowNegativeBalance: account?.allowNegativeBalance ?? true,
        accountNumber: account?.accountNumber ?? "",
      });
    }
  }, [open, account, defaultType, reset]);

  async function onSubmit(values: FormValues) {
    const payload = { ...values, accountNumber: values.accountNumber || undefined };
    const result = isEdit && account
      ? await updateAccountAction(account.id, payload)
      : await createAccountAction(payload);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(isEdit ? "Compte modifié." : "Compte créé.");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier le compte" : "Nouveau compte"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Mettez à jour les informations du compte." : "Ajoutez un compte cash, banque ou mobile money."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="account-name">Nom</Label>
            <Input id="account-name" placeholder={NAME_PLACEHOLDERS[watch("type")]} {...register("name")} />
            <p className="text-xs text-muted-foreground">{NAME_HINTS[watch("type")]}</p>
            <FieldError message={errors.name?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="account-type">Type</Label>
            <Select value={watch("type")} onValueChange={(value) => setValue("type", value as AccountType)}>
              <SelectTrigger id="account-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[]).map((type) => (
                  <SelectItem key={type} value={type}>
                    {ACCOUNT_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {watch("type") !== "CASH" ? (
            <div className="space-y-1.5">
              <Label htmlFor="account-number">{NUMBER_LABELS[watch("type")]} (optionnel)</Label>
              <Input
                id="account-number"
                placeholder={NUMBER_PLACEHOLDERS[watch("type")]}
                {...register("accountNumber")}
              />
              <p className="text-xs text-muted-foreground">
                Utile pour différencier plusieurs comptes {ACCOUNT_TYPE_LABELS[watch("type")].toLowerCase()}.
              </p>
              <FieldError message={errors.accountNumber?.message} />
            </div>
          ) : null}

          <div className="flex items-center justify-between rounded-lg border border-border-strong bg-surface px-3 py-3">
            <div>
              <Label htmlFor="allow-negative">Autoriser le solde négatif</Label>
              <p className="text-xs text-muted-foreground">Désactivez pour bloquer les dépenses qui dépassent le solde.</p>
            </div>
            <Switch
              id="allow-negative"
              checked={watch("allowNegativeBalance")}
              onCheckedChange={(checked) => setValue("allowNegativeBalance", checked)}
            />
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
