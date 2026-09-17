"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createDebt, updateDebt, deleteDebt, addDebtPayment } from "@/lib/data/debts";
import { ApiError } from "@/lib/api-error";
import type { ActionResult } from "./accounts";

const DebtSchema = z.object({
  direction: z.enum(["RECEIVABLE", "PAYABLE"]),
  personName: z.string().trim().min(1, "Le nom de la personne est requis."),
  amount: z.number().positive("Le montant doit être positif."),
  description: z.string().trim().max(255).optional(),
  dueDate: z.string().optional(),
});

const DebtPaymentSchema = z.object({
  accountId: z.number().int().positive("Le compte est requis."),
  amount: z.number().positive("Le montant doit être positif."),
  paymentDate: z.string().min(1, "La date est requise."),
});

function revalidateDebtViews() {
  revalidatePath("/planification/dettes");
  revalidatePath("/planification/creances");
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
}

export async function createDebtAction(input: unknown): Promise<ActionResult> {
  const parsed = DebtSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  try {
    await createDebt(parsed.data);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Création impossible." };
  }

  revalidateDebtViews();
  return { success: true };
}

export async function updateDebtAction(id: number, input: unknown): Promise<ActionResult> {
  const parsed = DebtSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  try {
    await updateDebt(id, parsed.data);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Modification impossible." };
  }

  revalidateDebtViews();
  return { success: true };
}

export async function deleteDebtAction(id: number): Promise<ActionResult> {
  try {
    await deleteDebt(id);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Suppression impossible." };
  }

  revalidateDebtViews();
  return { success: true };
}

export async function addDebtPaymentAction(debtId: number, input: unknown): Promise<ActionResult> {
  const parsed = DebtPaymentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  try {
    await addDebtPayment(debtId, parsed.data);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Enregistrement impossible." };
  }

  revalidateDebtViews();
  return { success: true };
}
