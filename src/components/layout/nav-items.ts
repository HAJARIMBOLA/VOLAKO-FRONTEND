import {
  LayoutDashboard,
  PieChart,
  ArrowLeftRight,
  CalendarDays,
  History,
  Wallet,
  Banknote,
  Building2,
  Smartphone,
  TrendingUp,
  TrendingDown,
  Boxes,
  CalendarClock,
  HandCoins,
  HandHeart,
  PiggyBank,
  CreditCard,
  Landmark,
  BarChart3,
} from "lucide-react";

export interface NavLeaf {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  comingSoon?: boolean;
}

export interface NavGroup {
  label: string;
  icon: typeof LayoutDashboard;
  href?: string;
  children?: NavLeaf[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Tableau de bord",
    icon: LayoutDashboard,
    children: [
      { href: "/dashboard", label: "Bilan", icon: PieChart },
      { href: "/dashboard/transactions", label: "Transactions", icon: ArrowLeftRight },
      { href: "/dashboard/calendrier", label: "Calendrier", icon: CalendarDays },
      { href: "/dashboard/chronologie", label: "Chronologie", icon: History },
    ],
  },
  {
    label: "Compte",
    icon: Wallet,
    children: [
      { href: "/accounts", label: "Cash", icon: Banknote },
      { href: "/accounts/banque", label: "Banque", icon: Building2 },
      { href: "/accounts/mobile-money", label: "Mobile Money", icon: Smartphone },
      { href: "/accounts/revenus", label: "Revenus", icon: TrendingUp },
      { href: "/accounts/depenses", label: "Dépenses", icon: TrendingDown },
      { href: "/accounts/inventaire", label: "Inventaire", icon: Boxes },
    ],
  },
  {
    label: "Planification",
    icon: CalendarClock,
    children: [
      { href: "/planification/dettes", label: "Dettes", icon: HandCoins },
      { href: "/planification/creances", label: "Créances", icon: HandHeart },
      { href: "/planification/credits", label: "Crédits", icon: CreditCard },
      { href: "/planification/fonds", label: "Fonds", icon: PiggyBank },
      { href: "/planification/impots", label: "Impôts", icon: Landmark, comingSoon: true },
      { href: "/planification/rapports", label: "Rapports", icon: BarChart3, comingSoon: true },
    ],
  },
];
