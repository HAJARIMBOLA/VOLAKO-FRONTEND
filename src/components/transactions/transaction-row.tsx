"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { deleteTransactionAction } from "@/actions/transactions";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TransactionFormDialog } from "./transaction-form-dialog";
import { formatDate, formatSignedAmount } from "@/lib/utils";
import type { Account, Category, Transaction } from "@/lib/types";

export function TransactionRow({
  transaction,
  accounts,
  categories,
}: {
  transaction: Transaction;
  accounts: Account[];
  categories: Category[];
}) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const router = useRouter();
  const isIncome = transaction.type === "INCOME";

  async function handleDelete() {
    setPending(true);
    const result = await deleteTransactionAction(transaction.id);
    setPending(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("Transaction supprimée.");
    setConfirmOpen(false);
    router.refresh();
  }

  return (
    <TableRow>
      <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(transaction.transactionDate)}</TableCell>
      <TableCell className="font-medium">{transaction.description || transaction.categoryName}</TableCell>
      <TableCell className="text-muted-foreground">{transaction.categoryName}</TableCell>
      <TableCell className="text-muted-foreground">{transaction.accountName}</TableCell>
      <TableCell className={`text-right font-mono tabular-nums ${isIncome ? "text-success" : "text-danger"}`}>
        {formatSignedAmount(transaction.amount, transaction.type)}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Actions">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setEditOpen(true)}>
              <Pencil className="size-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setConfirmOpen(true)} className="text-danger">
              <Trash2 className="size-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>

      <TransactionFormDialog
        transaction={transaction}
        accounts={accounts}
        categories={categories}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Supprimer cette transaction ?"
        description="Cette action est définitive et affectera le solde du compte associé."
        confirmLabel="Supprimer"
        destructive
        pending={pending}
        onConfirm={handleDelete}
      />
    </TableRow>
  );
}
