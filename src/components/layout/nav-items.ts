import {
  LayoutDashboard,
  Wallet,
  CalendarClock,
  HandCoins,
  HandHeart,
  PiggyBank,
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
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Compte",
    href: "/accounts",
    icon: Wallet,
  },
  {
    label: "Planification",
    icon: CalendarClock,
    children: [
      { href: "/planification/dettes", label: "Dettes", icon: HandCoins },
      { href: "/planification/creances", label: "Créances", icon: HandHeart },
      { href: "/planification/fonds", label: "Fonds", icon: PiggyBank },
      { href: "/planification/impots", label: "Impôts", icon: Landmark, comingSoon: true },
      { href: "/planification/rapports", label: "Rapports", icon: BarChart3, comingSoon: true },
    ],
  },
];
