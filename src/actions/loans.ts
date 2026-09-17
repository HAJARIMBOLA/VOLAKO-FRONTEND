"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createLoan, updateLoan, deleteLoan, addLoanPayment } from "@/lib/data/loans";
import { ApiError } from "@/lib/api-error";
import type { ActionResult } from "./accounts";

const LoanSchema = z.object({
  name: z.string().trim().min(1, "Le nom du crédit est requis."),
  principalAmount: z.number().positive("Le montant du principal doit être positif."),
  monthlyPayment: z.number().positive("La mensualité doit être positive."),
  durationMonths: z.number().int().positive("La durée doit être d'au moins 1 mois."),
  startDate: z.string().min(1, "La date de début est requise."),
});

const LoanPaymentSchema = z.object({
  accountId: z.number().int().positive("Le compte est requis."),
  amount: z.number().positive("Le montant doit être positif."),
  paymentDate: z.string().min(1, "La date est requise."),
});

function revalidateLoanViews() {
  revalidatePath("/planification/credits");
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
}

export async function createLoanAction(input: unknown): Promise<ActionResult> {
  const parsed = LoanSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  try {
    await createLoan(parsed.data);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Création impossible." };
  }

  revalidateLoanViews();
  return { success: true };
}

export async function updateLoanAction(id: number, input: unknown): Promise<ActionResult> {
  const parsed = LoanSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  try {
    await updateLoan(id, parsed.data);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Modification impossible." };
  }

  revalidateLoanViews();
  return { success: true };
}

export async function deleteLoanAction(id: number): Promise<ActionResult> {
  try {
    await deleteLoan(id);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Suppression impossible." };
  }

  revalidateLoanViews();
  return { success: true };
}

export async function addLoanPaymentAction(loanId: number, input: unknown): Promise<ActionResult> {
  const parsed = LoanPaymentSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  try {
    await addLoanPayment(loanId, parsed.data);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Enregistrement impossible." };
  }

  revalidateLoanViews();
  return { success: true };
}
