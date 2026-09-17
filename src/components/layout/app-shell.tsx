"use client";

import * as React from "react";
import { Wallet, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { SidebarNav } from "./sidebar-nav";
import { HamburgerButton } from "./hamburger-button";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

function Logo({ small }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={
          small
            ? "flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground"
            : "flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
        }
      >
        <Wallet className={small ? "size-3.5" : "size-4"} />
      </div>
      <span className={small ? "text-sm font-semibold tracking-tight text-foreground" : "text-base font-semibold tracking-tight text-foreground"}>
        VOLAKO
      </span>
    </div>
  );
}

function ShellInner({ phoneNumber, children }: { phoneNumber: string; children: React.ReactNode }) {
  const { desktopOpen, mobileOpen, closeMobile } = useSidebar();

  // Escape closes the mobile drawer; body scroll is locked while it's open.
  React.useEffect(() => {
    if (!mobileOpen) return;

    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMobile();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen, closeMobile]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 overflow-hidden border-border transition-[width] duration-200 ease-in-out md:flex md:flex-col",
            desktopOpen ? "md:w-64 md:border-r" : "md:w-0 md:border-r-0"
          )}
        >
          <div className="w-64 shrink-0">
            <div className="px-5 py-5">
              <Logo />
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarNav />
            </div>
          </div>
        </aside>

        <div
          className={cn(
            "fixed inset-0 z-50 transition-opacity duration-200 md:hidden",
            mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          )}
          aria-hidden={!mobileOpen}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeMobile} />
          <div
            className={cn(
              "absolute left-0 top-0 flex h-full w-72 flex-col bg-card shadow-2xl transition-transform duration-300 ease-in-out",
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex items-center justify-between px-5 py-5">
              <Logo />
              <button
                onClick={closeMobile}
                aria-label="Fermer le menu"
                className="cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarNav />
            </div>
          </div>
        </div>

        <div className="flex min-h-screen w-full min-w-0 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
            <div className="flex items-center gap-2">
              <HamburgerButton />
              <div className="md:hidden">
                <Logo small />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <UserMenu phoneNumber={phoneNumber} />
            </div>
          </header>

          <main className="flex-1 px-4 pb-10 pt-6 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ phoneNumber, children }: { phoneNumber: string; children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ShellInner phoneNumber={phoneNumber}>{children}</ShellInner>
    </SidebarProvider>
  );
}
