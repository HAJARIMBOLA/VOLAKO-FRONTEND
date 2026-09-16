import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

export function formatAmount(amount: number): string {
  return `${currencyFormatter.format(Math.round(amount))} Ar`;
}

export function formatSignedAmount(amount: number, type: "INCOME" | "EXPENSE"): string {
  const sign = type === "INCOME" ? "+" : "−";
  return `${sign} ${currencyFormatter.format(Math.round(Math.abs(amount)))} Ar`;
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}
