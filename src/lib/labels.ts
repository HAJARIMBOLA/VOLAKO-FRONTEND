import type { AccountType, TransactionType } from "./types";

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  CASH: "Espèces",
  BANK: "Banque",
  MOBILE_MONEY: "Mobile Money",
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  INCOME: "Revenu",
  EXPENSE: "Dépense",
};
