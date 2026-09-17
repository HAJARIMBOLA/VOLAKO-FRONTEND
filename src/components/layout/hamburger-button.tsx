"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./sidebar-context";

export function HamburgerButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Basculer le menu">
      <Menu className="size-4" />
    </Button>
  );
}
