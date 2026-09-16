import "server-only";
import { backendFetch } from "../backend";
import { withAuth, withAuthRetry } from "./helpers";
import type { Transaction, TransactionFilters, TransactionType } from "../types";

export interface TransactionInput {
  type: TransactionType;
  amount: number;
  accountId: number;
  categoryId: number;
  description?: string;
  transactionDate: string;
}

export function getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
  return withAuth((token) =>
    backendFetch<Transaction[]>("/api/transactions", {
      accessToken: token,
      searchParams: {
        accountId: filters.accountId,
        categoryId: filters.categoryId,
        type: filters.type,
        from: filters.from,
        to: filters.to,
      },
    })
  );
}

export function createTransaction(input: TransactionInput): Promise<Transaction> {
  return withAuthRetry((token) =>
    backendFetch<Transaction>("/api/transactions", { method: "POST", body: input, accessToken: token })
  );
}

export function updateTransaction(id: number, input: TransactionInput): Promise<Transaction> {
  return withAuthRetry((token) =>
    backendFetch<Transaction>(`/api/transactions/${id}`, { method: "PUT", body: input, accessToken: token })
  );
}

export function deleteTransaction(id: number): Promise<void> {
  return withAuthRetry((token) =>
    backendFetch<void>(`/api/transactions/${id}`, { method: "DELETE", accessToken: token })
  );
}
