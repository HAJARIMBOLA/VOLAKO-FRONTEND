import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTransactions } from "@/lib/data/transactions";
import { cn, formatAmount } from "@/lib/utils";

export const metadata: Metadata = { title: "Calendrier — VOLAKO" };

const WEEKDAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTH_FORMATTER = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });

function parseMonthParam(month?: string): { year: number; monthIndex: number } {
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [year, m] = month.split("-").map(Number);
    return { year, monthIndex: m - 1 };
  }
  const now = new Date();
  return { year: now.getFullYear(), monthIndex: now.getMonth() };
}

function toMonthParam(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

function isoDate(year: number, monthIndex: number, day: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const { year, monthIndex } = parseMonthParam(month);

  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const from = isoDate(year, monthIndex, 1);
  const to = isoDate(year, monthIndex, daysInMonth);

  const transactions = await getTransactions({ from, to });

  const totalsByDay = new Map<string, { income: number; expense: number }>();
  for (const t of transactions) {
    const entry = totalsByDay.get(t.transactionDate) ?? { income: 0, expense: 0 };
    if (t.type === "INCOME") entry.income += t.amount;
    else entry.expense += t.amount;
    totalsByDay.set(t.transactionDate, entry);
  }

  // getDay(): 0=Sunday..6=Saturday — shift so the grid starts on Monday.
  const leadingBlanks = (firstDay.getDay() + 6) % 7;
  const cells: (number | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = monthIndex === 0 ? toMonthParam(year - 1, 11) : toMonthParam(year, monthIndex - 1);
  const nextMonth = monthIndex === 11 ? toMonthParam(year + 1, 0) : toMonthParam(year, monthIndex + 1);
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Calendrier</h1>
        <p className="text-sm text-muted-foreground">Vos mouvements du mois, jour par jour.</p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold capitalize text-foreground">{MONTH_FORMATTER.format(firstDay)}</h2>
        <div className="flex gap-1">
          <Link
            href={`/dashboard/calendrier?month=${prevMonth}`}
            className="flex size-8 items-center justify-center rounded-lg border border-border-strong text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="size-4" />
          </Link>
          <Link
            href={`/dashboard/calendrier?month=${nextMonth}`}
            className="flex size-8 items-center justify-center rounded-lg border border-border-strong text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Mois suivant"
          >
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-muted-foreground">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, index) => {
          if (day === null) return <div key={`blank-${index}`} />;
          const dateIso = isoDate(year, monthIndex, day);
          const totals = totalsByDay.get(dateIso);
          const net = (totals?.income ?? 0) - (totals?.expense ?? 0);
          const isToday = dateIso === todayIso;

          return (
            <div
              key={dateIso}
              className={cn(
                "flex min-h-[72px] flex-col gap-1 rounded-lg border p-1.5 text-left",
                isToday ? "border-primary/50 bg-primary/5" : "border-border bg-surface"
              )}
            >
              <span className={cn("text-xs", isToday ? "font-semibold text-primary" : "text-muted-foreground")}>{day}</span>
              {totals ? (
                <span
                  className={cn(
                    "font-mono text-[11px] font-medium tabular-nums leading-tight",
                    net >= 0 ? "text-success" : "text-danger"
                  )}
                >
                  {net >= 0 ? "+" : ""}
                  {formatAmount(net)}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
