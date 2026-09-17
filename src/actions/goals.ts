"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createGoal, updateGoal, deleteGoal, addGoalContribution } from "@/lib/data/goals";
import { ApiError } from "@/lib/api-error";
import type { ActionResult } from "./accounts";

const GoalSchema = z.object({
  name: z.string().trim().min(1, "Le nom du fonds est requis."),
  targetAmount: z.number().positive("Le montant cible doit être positif."),
  targetDate: z.string().optional(),
});

const ContributionSchema = z.object({
  accountId: z.number().int().positive("Le compte est requis."),
  amount: z.number().positive("Le montant doit être positif."),
  contributionDate: z.string().min(1, "La date est requise."),
});

function revalidateGoalViews() {
  revalidatePath("/planification/fonds");
  revalidatePath("/dashboard");
}

export async function createGoalAction(input: unknown): Promise<ActionResult> {
  const parsed = GoalSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  try {
    await createGoal(parsed.data);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Création impossible." };
  }

  revalidateGoalViews();
  return { success: true };
}

export async function updateGoalAction(id: number, input: unknown): Promise<ActionResult> {
  const parsed = GoalSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  try {
    await updateGoal(id, parsed.data);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Modification impossible." };
  }

  revalidateGoalViews();
  return { success: true };
}

export async function deleteGoalAction(id: number): Promise<ActionResult> {
  try {
    await deleteGoal(id);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Suppression impossible." };
  }

  revalidateGoalViews();
  return { success: true };
}

export async function addGoalContributionAction(goalId: number, input: unknown): Promise<ActionResult> {
  const parsed = ContributionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  try {
    await addGoalContribution(goalId, parsed.data);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Enregistrement impossible." };
  }

  revalidateGoalViews();
  return { success: true };
}
