"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

function toggleTheme() {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  try {
    localStorage.setItem("volako-theme", next);
  } catch {
    // Private browsing / blocked storage: theme just won't persist.
  }
}

export function ThemeToggle() {
  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Changer de thème">
      <Sun className="size-4 [html[data-theme='light']_&]:hidden" />
      <Moon className="hidden size-4 [html[data-theme='light']_&]:block" />
    </Button>
  );
}
