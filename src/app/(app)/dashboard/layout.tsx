import { SubTabs } from "@/components/layout/sub-tabs";

const TABS = [
  { href: "/dashboard", label: "Bilan" },
  { href: "/dashboard/transactions", label: "Transactions" },
  { href: "/dashboard/calendrier", label: "Calendrier" },
  { href: "/dashboard/chronologie", label: "Chronologie" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground">Bilan, transactions, calendrier et chronologie de vos finances.</p>
      </div>
      <SubTabs items={TABS} />
      {children}
    </div>
  );
}
