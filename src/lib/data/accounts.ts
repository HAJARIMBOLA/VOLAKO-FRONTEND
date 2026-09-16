import "server-only";
import { backendFetch } from "../backend";
import { withAuth, withAuthRetry } from "./helpers";
import type { Account, AccountType } from "../types";

export interface AccountInput {
  name: string;
  type: AccountType;
  allowNegativeBalance: boolean;
}

export function getAccounts(): Promise<Account[]> {
  return withAuth((token) => backendFetch<Account[]>("/api/accounts", { accessToken: token }));
}

export function createAccount(input: AccountInput): Promise<Account> {
  return withAuthRetry((token) =>
    backendFetch<Account>("/api/accounts", { method: "POST", body: input, accessToken: token })
  );
}

export function updateAccount(id: number, input: AccountInput): Promise<Account> {
  return withAuthRetry((token) =>
    backendFetch<Account>(`/api/accounts/${id}`, { method: "PUT", body: input, accessToken: token })
  );
}

export function archiveAccount(id: number): Promise<void> {
  return withAuthRetry((token) =>
    backendFetch<void>(`/api/accounts/${id}`, { method: "DELETE", accessToken: token })
  );
}
