import { LayoutDashboard, Wallet, Tags, ArrowLeftRight } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Tableau de bord", shortLabel: "Accueil", icon: LayoutDashboard },
  { href: "/accounts", label: "Comptes", shortLabel: "Comptes", icon: Wallet },
  { href: "/categories", label: "Catégories", shortLabel: "Catégories", icon: Tags },
  { href: "/transactions", label: "Transactions", shortLabel: "Mouvements", icon: ArrowLeftRight },
] as const;
