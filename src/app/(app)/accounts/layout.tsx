import { SubTabs } from "@/components/layout/sub-tabs";

const TABS = [
  { href: "/accounts", label: "Comptes" },
  { href: "/accounts/revenus", label: "Revenus" },
  { href: "/accounts/depenses", label: "Dépenses" },
  { href: "/accounts/inventaire", label: "Inventaire" },
];

export default function AccountsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Compte</h1>
        <p className="text-sm text-muted-foreground">Cash, banque, mobile money — tout au même endroit.</p>
      </div>
      <SubTabs items={TABS} />
      {children}
    </div>
  );
}
