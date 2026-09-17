"use client";

import { Menu, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-context";

export function HamburgerButton() {
  const { desktopOpen, mobileOpen, toggleSidebar } = useSidebar();
  const isOpen = desktopOpen || mobileOpen;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={isOpen}
    >
      <span className="hidden md:inline-flex">
        {desktopOpen ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
      </span>
      <span className="inline-flex md:hidden">{mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}</span>
    </Button>
  );
}
