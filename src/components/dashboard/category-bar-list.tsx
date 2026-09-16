import { formatAmount } from "@/lib/utils";

export interface CategoryTotal {
  categoryId: number;
  categoryName: string;
  total: number;
}

const DOT_COLORS = [
  "bg-primary",
  "bg-success",
  "bg-warning",
  "bg-danger",
  "bg-purple-400",
  "bg-cyan-400",
];

export function CategoryBarList({ items }: { items: CategoryTotal[] }) {
  const max = Math.max(...items.map((item) => item.total), 1);

  return (
    <ul className="space-y-3">
      {items.map((item, index) => {
        const percent = Math.round((item.total / max) * 100);
        return (
          <li key={item.categoryId}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2 text-foreground">
                <span className={`size-2 shrink-0 rounded-full ${DOT_COLORS[index % DOT_COLORS.length]}`} aria-hidden />
                <span className="truncate">{item.categoryName}</span>
              </span>
              <span className="shrink-0 font-mono tabular-nums text-muted-foreground">{formatAmount(item.total)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted" role="img" aria-label={`${item.categoryName}: ${formatAmount(item.total)}`}>
              <div
                className={`h-full rounded-full ${DOT_COLORS[index % DOT_COLORS.length]}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
