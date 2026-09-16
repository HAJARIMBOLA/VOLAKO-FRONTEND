"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreVertical, Pencil, EyeOff } from "lucide-react";
import { deactivateCategoryAction } from "@/actions/categories";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryFormDialog } from "./category-form-dialog";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

export function CategoryRow({ category }: { category: Category }) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const router = useRouter();

  async function handleDeactivate() {
    setPending(true);
    const result = await deactivateCategoryAction(category.id);
    setPending(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("Catégorie désactivée.");
    setConfirmOpen(false);
    router.refresh();
  }

  return (
    <TableRow className={cn(!category.active && "opacity-60")}>
      <TableCell className="font-medium">{category.name}</TableCell>
      <TableCell>
        <Badge variant={category.type === "INCOME" ? "success" : "danger"}>
          {category.type === "INCOME" ? "Revenu" : "Dépense"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-1.5">
          {category.isSystem ? <Badge variant="primary">Système</Badge> : null}
          {!category.active ? <Badge variant="neutral">Désactivée</Badge> : null}
        </div>
      </TableCell>
      <TableCell className="text-right">
        {category.active ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Actions pour ${category.name}`}>
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                <Pencil className="size-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setConfirmOpen(true)} className="text-danger">
                <EyeOff className="size-4" />
                Désactiver
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </TableCell>

      <CategoryFormDialog category={category} open={editOpen} onOpenChange={setEditOpen} />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Désactiver cette catégorie ?"
        description={`"${category.name}" ne sera plus proposée pour de nouvelles transactions.${
          category.isSystem ? " Les catégories système ne peuvent pas être supprimées, seulement désactivées." : ""
        }`}
        confirmLabel="Désactiver"
        destructive
        pending={pending}
        onConfirm={handleDeactivate}
      />
    </TableRow>
  );
}
