import "server-only";
import { backendFetch } from "../backend";
import { withAuth, withAuthRetry } from "./helpers";
import type { Category, TransactionType } from "../types";

export interface CategoryInput {
  name: string;
  type: TransactionType;
}

export function getCategories(): Promise<Category[]> {
  return withAuth((token) => backendFetch<Category[]>("/api/categories", { accessToken: token }));
}

export function createCategory(input: CategoryInput): Promise<Category> {
  return withAuthRetry((token) =>
    backendFetch<Category>("/api/categories", { method: "POST", body: input, accessToken: token })
  );
}

export function updateCategory(id: number, input: CategoryInput): Promise<Category> {
  return withAuthRetry((token) =>
    backendFetch<Category>(`/api/categories/${id}`, { method: "PUT", body: input, accessToken: token })
  );
}

export function deactivateCategory(id: number): Promise<void> {
  return withAuthRetry((token) =>
    backendFetch<void>(`/api/categories/${id}`, { method: "DELETE", accessToken: token })
  );
}
