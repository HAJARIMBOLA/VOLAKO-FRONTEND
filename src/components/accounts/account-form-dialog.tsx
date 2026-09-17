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
});

type FormValues = z.infer<typeof schema>;

export function AccountFormDialog({
  account,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  account?: Account;
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
      type: account?.type ?? "CASH",
      allowNegativeBalance: account?.allowNegativeBalance ?? true,
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        name: account?.name ?? "",
        type: account?.type ?? "CASH",
        allowNegativeBalance: account?.allowNegativeBalance ?? true,
      });
    }
  }, [open, account, reset]);

  async function onSubmit(values: FormValues) {
    const result = isEdit && account
      ? await updateAccountAction(account.id, values)
      : await createAccountAction(values);

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
            <Input id="account-name" placeholder="Ex. MVola, BNI, Cash" {...register("name")} />
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
