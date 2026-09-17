"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createAccount, updateAccount, archiveAccount } from "@/lib/data/accounts";
import { ApiError } from "@/lib/api-error";

export type ActionResult = { success: true } | { success: false; message: string };

const AccountSchema = z.object({
  name: z.string().trim().min(1, "Le nom du compte est requis."),
  type: z.enum(["CASH", "BANK", "MOBILE_MONEY"]),
  allowNegativeBalance: z.boolean(),
  accountNumber: z.string().trim().max(50).optional(),
});

function revalidateAccountViews() {
  revalidatePath("/accounts", "layout");
  revalidatePath("/dashboard", "layout");
}

export async function createAccountAction(input: unknown): Promise<ActionResult> {
  const parsed = AccountSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  try {
    await createAccount(parsed.data);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Création impossible." };
  }

  revalidateAccountViews();
  return { success: true };
}

export async function updateAccountAction(id: number, input: unknown): Promise<ActionResult> {
  const parsed = AccountSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  try {
    await updateAccount(id, parsed.data);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Modification impossible." };
  }

  revalidateAccountViews();
  return { success: true };
}

export async function archiveAccountAction(id: number): Promise<ActionResult> {
  try {
    await archiveAccount(id);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Archivage impossible." };
  }

  revalidateAccountViews();
  return { success: true };
}
