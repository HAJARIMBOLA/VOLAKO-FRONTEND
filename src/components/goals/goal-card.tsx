"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreVertical, Pencil, Trash2, PiggyBank } from "lucide-react";
import { deleteGoalAction } from "@/actions/goals";
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
import { GoalFormDialog } from "./goal-form-dialog";
import { GoalContributionDialog } from "./goal-contribution-dialog";
import { formatAmount, formatDate } from "@/lib/utils";
import type { Account, Goal } from "@/lib/types";

export function GoalCard({ goal, accounts }: { goal: Goal; accounts: Account[] }) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [contributeOpen, setContributeOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const router = useRouter();

  async function handleDelete() {
    setPending(true);
    const result = await deleteGoalAction(goal.id);
    setPending(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("Fonds supprimé.");
    setConfirmOpen(false);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <PiggyBank className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-foreground">{goal.name}</p>
                {goal.completed ? <Badge variant="success">Atteint</Badge> : null}
              </div>
              {goal.targetDate ? (
                <p className="text-xs text-muted-foreground">Objectif : {formatDate(goal.targetDate)}</p>
              ) : null}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Actions pour ${goal.name}`}>
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setContributeOpen(true)}>
                <PiggyBank className="size-4" />
                Alimenter
              </DropdownMenuItem>
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
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-mono font-semibold text-foreground">{formatAmount(goal.savedAmount)}</span>
            <span className="text-muted-foreground">sur {formatAmount(goal.targetAmount)}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={goal.completed ? "h-full rounded-full bg-success" : "h-full rounded-full bg-primary"}
              style={{ width: `${goal.progressPercent}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{goal.progressPercent}% — reste {formatAmount(goal.remainingAmount)}</p>
        </div>
      </CardContent>

      <GoalFormDialog goal={goal} open={editOpen} onOpenChange={setEditOpen} />
      <GoalContributionDialog goal={goal} accounts={accounts} open={contributeOpen} onOpenChange={setContributeOpen} />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Supprimer ce fonds ?"
        description={`"${goal.name}" et son historique de contributions seront définitivement supprimés.`}
        confirmLabel="Supprimer"
        destructive
        pending={pending}
        onConfirm={handleDelete}
      />
    </Card>
  );
}
