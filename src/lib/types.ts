export type TransactionType = "INCOME" | "EXPENSE";
export type AccountType = "CASH" | "BANK" | "MOBILE_MONEY";

export interface User {
  id: number;
  phoneNumber: string;
  fullName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Account {
  id: number;
  name: string;
  type: AccountType;
  currency: string;
  allowNegativeBalance: boolean;
  active: boolean;
  balance: number;
}

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  isSystem: boolean;
  active: boolean;
}

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  accountId: number;
  accountName: string;
  categoryId: number;
  categoryName: string;
  description: string | null;
  transactionDate: string;
}

export interface Dashboard {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  periodFrom: string;
  periodTo: string;
}

export interface TransactionFilters {
  accountId?: number;
  categoryId?: number;
  type?: TransactionType;
  from?: string;
  to?: string;
}

export interface ApiErrorBody {
  error: string;
  message: string;
}
