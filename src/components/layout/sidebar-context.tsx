"use client";

import * as React from "react";

interface SidebarContextValue {
  desktopOpen: boolean;
  mobileOpen: boolean;
  toggleSidebar: () => void;
  closeMobile: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  // Session-only: no localStorage persistence, so the server-rendered and
  // hydrated markup always agree (no flash / hydration mismatch).
  const [desktopOpen, setDesktopOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const toggleSidebar = React.useCallback(() => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
      setDesktopOpen((prev) => !prev);
    } else {
      setMobileOpen((prev) => !prev);
    }
  }, []);

  const closeMobile = React.useCallback(() => setMobileOpen(false), []);

  return (
    <SidebarContext.Provider value={{ desktopOpen, mobileOpen, toggleSidebar, closeMobile }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider");
  return ctx;
}
