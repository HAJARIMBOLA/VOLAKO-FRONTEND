"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createCategory, updateCategory, deactivateCategory } from "@/lib/data/categories";
import { ApiError } from "@/lib/api-error";
import type { ActionResult } from "./accounts";

const CategorySchema = z.object({
  name: z.string().trim().min(1, "Le nom de la catégorie est requis."),
  type: z.enum(["INCOME", "EXPENSE"]),
});

function revalidateCategoryViews() {
  revalidatePath("/categories");
  revalidatePath("/dashboard", "layout");
}

export async function createCategoryAction(input: unknown): Promise<ActionResult> {
  const parsed = CategorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  try {
    await createCategory(parsed.data);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Création impossible." };
  }

  revalidateCategoryViews();
  return { success: true };
}

export async function updateCategoryAction(id: number, input: unknown): Promise<ActionResult> {
  const parsed = CategorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  try {
    await updateCategory(id, parsed.data);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Modification impossible." };
  }

  revalidateCategoryViews();
  return { success: true };
}

export async function deactivateCategoryAction(id: number): Promise<ActionResult> {
  try {
    await deactivateCategory(id);
  } catch (error) {
    return { success: false, message: error instanceof ApiError ? error.message : "Désactivation impossible." };
  }

  revalidateCategoryViews();
  return { success: true };
}
