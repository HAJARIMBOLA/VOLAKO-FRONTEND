import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1 p-5 pb-3", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-sm font-medium text-muted-foreground", className)} {...props} />;
}

function CardValue({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("font-mono text-2xl font-semibold tabular-nums text-foreground", className)} {...props} />;
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center p-5 pt-0", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardValue, CardContent, CardFooter };
