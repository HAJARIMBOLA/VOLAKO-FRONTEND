import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "neutral" | "success" | "danger" | "primary";
}) {
  const toneClasses: Record<string, string> = {
    neutral: "bg-muted text-foreground",
    success: "bg-success/10 text-success",
    danger: "bg-danger/10 text-danger",
    primary: "bg-primary/10 text-primary",
  };

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", toneClasses[tone])}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="truncate font-mono text-xl font-semibold tabular-nums text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
