"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_GROUPS } from "./nav-items";
import { useSidebar } from "./sidebar-context";

export function SidebarNav() {
  const pathname = usePathname();
  const { closeMobile } = useSidebar();

  return (
    <nav aria-label="Navigation principale" className="flex flex-col gap-4 p-3">
      {NAV_GROUPS.map((group) => {
        if (group.href) {
          const isActive = pathname === group.href || pathname.startsWith(`${group.href}/`);
          return (
            <Link
              key={group.href}
              href={group.href}
              onClick={closeMobile}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <group.icon className="size-4 shrink-0" />
              {group.label}
            </Link>
          );
        }

        return (
          <div key={group.label} className="space-y-1">
            <div className="flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <group.icon className="size-3.5" />
              {group.label}
            </div>
            <div className="flex flex-col gap-1">
              {group.children?.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg px-3 py-2 pl-6 text-sm font-medium transition-colors",
                      isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="size-4 shrink-0" />
                      {item.label}
                    </span>
                    {item.comingSoon ? (
                      <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        Bientôt
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
