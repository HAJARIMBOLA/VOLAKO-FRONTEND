import "server-only";
import { backendFetch } from "../backend";
import { withAuth, withAuthRetry } from "./helpers";
import type { Loan, LoanPayment } from "../types";

export interface LoanInput {
  name: string;
  principalAmount: number;
  monthlyPayment: number;
  durationMonths: number;
  startDate: string;
}

export interface LoanPaymentInput {
  accountId: number;
  amount: number;
  paymentDate: string;
}

export function getLoans(): Promise<Loan[]> {
  return withAuth((token) => backendFetch<Loan[]>("/api/loans", { accessToken: token }));
}

export function getLoanPayments(loanId: number): Promise<LoanPayment[]> {
  return withAuth((token) => backendFetch<LoanPayment[]>(`/api/loans/${loanId}/payments`, { accessToken: token }));
}

export function createLoan(input: LoanInput): Promise<Loan> {
  return withAuthRetry((token) => backendFetch<Loan>("/api/loans", { method: "POST", body: input, accessToken: token }));
}

export function updateLoan(id: number, input: LoanInput): Promise<Loan> {
  return withAuthRetry((token) =>
    backendFetch<Loan>(`/api/loans/${id}`, { method: "PUT", body: input, accessToken: token })
  );
}

export function deleteLoan(id: number): Promise<void> {
  return withAuthRetry((token) => backendFetch<void>(`/api/loans/${id}`, { method: "DELETE", accessToken: token }));
}

export function addLoanPayment(loanId: number, input: LoanPaymentInput): Promise<LoanPayment> {
  return withAuthRetry((token) =>
    backendFetch<LoanPayment>(`/api/loans/${loanId}/payments`, { method: "POST", body: input, accessToken: token })
  );
}
