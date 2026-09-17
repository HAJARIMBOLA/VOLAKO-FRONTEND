import Link from "next/link";
import { Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubTabs } from "@/components/layout/sub-tabs";

const TABS = [
  { href: "/accounts", label: "Cash" },
  { href: "/accounts/banque", label: "Banque" },
  { href: "/accounts/mobile-money", label: "Mobile Money" },
  { href: "/accounts/revenus", label: "Revenus" },
  { href: "/accounts/depenses", label: "Dépenses" },
  { href: "/accounts/inventaire", label: "Inventaire" },
];

export default function AccountsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Compte</h1>
          <p className="text-sm text-muted-foreground">Cash, banque, mobile money — chacun dans sa section.</p>
        </div>
        <Button asChild size="sm" variant="ghost">
          <Link href="/categories">
            <Tags className="size-4" />
            Gérer les catégories
          </Link>
        </Button>
      </div>
      <SubTabs items={TABS} />
      {children}
    </div>
  );
}
