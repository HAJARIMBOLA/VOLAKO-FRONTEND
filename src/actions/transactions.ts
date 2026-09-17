"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createTransaction, updateTransaction, deleteTransaction } from "@/lib/data/transactions";
import { ApiError } from "@/lib/api-error";
import type { ActionResult } from "./accounts";

const TransactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number().positive("Le montant doit être positif."),
  accountId: z.number().int().positive("Le compte est requis."),
  categoryId: z.number().int().positive("La catégorie est requise."),
  description: z.string().trim().max(255).optional(),
  transactionDate: z.string().min(1, "La date est requise."),
});

function revalidateTransactionViews() {
  revalidatePath("/dashboard", "layout");
  revalidatePath("/accounts", "layout");
}

export async function createTransactionAction(input: unknown): Promise<ActionResult> {
  const parsed = TransactionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  try {
    await createTransaction(parsed.data);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Création impossible." };
  }

  revalidateTransactionViews();
  return { success: true };
}

export async function updateTransactionAction(id: number, input: unknown): Promise<ActionResult> {
  const parsed = TransactionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  try {
    await updateTransaction(id, parsed.data);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Modification impossible." };
  }

  revalidateTransactionViews();
  return { success: true };
}

export async function deleteTransactionAction(id: number): Promise<ActionResult> {
  try {
    await deleteTransaction(id);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Suppression impossible." };
  }

  revalidateTransactionViews();
  return { success: true };
}
