"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Banknote, Building2, Smartphone, MoreVertical, Pencil, Archive } from "lucide-react";
import { archiveAccountAction } from "@/actions/accounts";
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
import { AccountFormDialog } from "./account-form-dialog";
import { formatAmount, cn } from "@/lib/utils";
import type { Account, AccountType } from "@/lib/types";

const TYPE_ICON: Record<AccountType, React.ElementType> = {
  CASH: Banknote,
  BANK: Building2,
  MOBILE_MONEY: Smartphone,
};

export function AccountCard({ account }: { account: Account }) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [archiveOpen, setArchiveOpen] = React.useState(false);
  const [archiving, setArchiving] = React.useState(false);
  const router = useRouter();
  const Icon = TYPE_ICON[account.type];

  async function handleArchive() {
    setArchiving(true);
    const result = await archiveAccountAction(account.id);
    setArchiving(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("Compte archivé.");
    setArchiveOpen(false);
    router.refresh();
  }

  return (
    <Card className={cn(!account.active && "opacity-60")}>
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <Link
          href={`/accounts/${account.id}`}
          className="-m-1 flex min-w-0 items-start gap-3 rounded-lg p-1 transition-colors hover:bg-muted"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
            <Icon className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-foreground">{account.name}</p>
              {!account.active ? <Badge variant="neutral">Archivé</Badge> : null}
              {!account.allowNegativeBalance ? <Badge variant="primary">Solde protégé</Badge> : null}
            </div>
            {account.accountNumber ? (
              <p className="truncate text-xs text-muted-foreground">{account.accountNumber}</p>
            ) : null}
            <p
              className={cn(
                "mt-1 font-mono text-lg font-semibold tabular-nums",
                account.balance < 0 ? "text-danger" : "text-foreground"
              )}
            >
              {formatAmount(account.balance)}
            </p>
          </div>
        </Link>

        {account.active ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Actions pour ${account.name}`}>
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                <Pencil className="size-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setArchiveOpen(true)} className="text-danger">
                <Archive className="size-4" />
                Archiver
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </CardContent>

      <AccountFormDialog account={account} open={editOpen} onOpenChange={setEditOpen} />
      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title="Archiver ce compte ?"
        description={`"${account.name}" ne sera plus disponible pour de nouvelles transactions. Son historique est conservé.`}
        confirmLabel="Archiver"
        destructive
        pending={archiving}
        onConfirm={handleArchive}
      />
    </Card>
  );
}
