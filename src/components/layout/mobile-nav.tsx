"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4">
        {NAV_ITEMS.map(({ href, shortLabel, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-[56px] flex-col items-center justify-center gap-1 text-[11px] font-medium",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
                {shortLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
