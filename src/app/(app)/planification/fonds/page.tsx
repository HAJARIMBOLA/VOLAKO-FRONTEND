import type { Metadata } from "next";
import { PiggyBank, Plus } from "lucide-react";
import { getGoals } from "@/lib/data/goals";
import { getAccounts } from "@/lib/data/accounts";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { GoalFormDialog } from "@/components/goals/goal-form-dialog";
import { GoalCard } from "@/components/goals/goal-card";

export const metadata: Metadata = { title: "Fonds — VOLAKO" };

export default async function FondsPage() {
  const [goals, accounts] = await Promise.all([getGoals(), getAccounts()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Fonds</h1>
          <p className="text-sm text-muted-foreground">Vos objectifs d&apos;épargne et leur progression.</p>
        </div>
        <GoalFormDialog
          trigger={
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4" />
                Nouveau fonds
              </Button>
            </DialogTrigger>
          }
        />
      </div>

      {goals.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} accounts={accounts} />
          ))}
        </div>
      ) : (
        <EmptyState icon={PiggyBank} title="Aucun fonds pour l'instant" description="Créez un objectif d'épargne à suivre." />
      )}
    </div>
  );
}
