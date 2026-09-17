import "server-only";
import { backendFetch } from "../backend";
import { withAuth, withAuthRetry } from "./helpers";
import type { Debt, DebtDirection, DebtPayment } from "../types";

export interface DebtInput {
  direction: DebtDirection;
  personName: string;
  amount: number;
  description?: string;
  dueDate?: string;
}

export interface DebtPaymentInput {
  accountId: number;
  amount: number;
  paymentDate: string;
}

export function getDebts(direction?: DebtDirection): Promise<Debt[]> {
  return withAuth((token) =>
    backendFetch<Debt[]>("/api/debts", { accessToken: token, searchParams: { direction } })
  );
}

export function getOverdueDebts(): Promise<Debt[]> {
  return withAuth((token) => backendFetch<Debt[]>("/api/debts/overdue", { accessToken: token }));
}

export function getDebtPayments(debtId: number): Promise<DebtPayment[]> {
  return withAuth((token) => backendFetch<DebtPayment[]>(`/api/debts/${debtId}/payments`, { accessToken: token }));
}

export function createDebt(input: DebtInput): Promise<Debt> {
  return withAuthRetry((token) => backendFetch<Debt>("/api/debts", { method: "POST", body: input, accessToken: token }));
}

export function updateDebt(id: number, input: DebtInput): Promise<Debt> {
  return withAuthRetry((token) =>
    backendFetch<Debt>(`/api/debts/${id}`, { method: "PUT", body: input, accessToken: token })
  );
}

export function deleteDebt(id: number): Promise<void> {
  return withAuthRetry((token) => backendFetch<void>(`/api/debts/${id}`, { method: "DELETE", accessToken: token }));
}

export function addDebtPayment(debtId: number, input: DebtPaymentInput): Promise<DebtPayment> {
  return withAuthRetry((token) =>
    backendFetch<DebtPayment>(`/api/debts/${debtId}/payments`, { method: "POST", body: input, accessToken: token })
  );
}
