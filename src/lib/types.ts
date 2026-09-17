export type TransactionType = "INCOME" | "EXPENSE";
export type AccountType = "CASH" | "BANK" | "MOBILE_MONEY";
export type DebtDirection = "RECEIVABLE" | "PAYABLE";
export type DebtStatus = "OPEN" | "PARTIALLY_PAID" | "PAID";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
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
  accountNumber: string | null;
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

export interface Debt {
  id: number;
  direction: DebtDirection;
  personName: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  description: string | null;
  dueDate: string | null;
  status: DebtStatus;
  overdue: boolean;
}

export interface DebtPayment {
  id: number;
  amount: number;
  paymentDate: string;
  accountId: number;
  accountName: string;
}

export interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  savedAmount: number;
  remainingAmount: number;
  progressPercent: number;
  targetDate: string | null;
  completed: boolean;
}

export interface ApiErrorBody {
  error: string;
  message: string;
}
