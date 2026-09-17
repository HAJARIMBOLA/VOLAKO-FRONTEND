import type { Metadata } from "next";
import { Boxes } from "lucide-react";
import { getAccounts } from "@/lib/data/accounts";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { ACCOUNT_TYPE_LABELS } from "@/lib/labels";
import { cn, formatAmount } from "@/lib/utils";

export const metadata: Metadata = { title: "Inventaire — VOLAKO" };

export default async function AccountsInventoryPage() {
  const accounts = await getAccounts();
  const total = accounts.filter((a) => a.active).reduce((sum, a) => sum + a.balance, 0);

  if (accounts.length === 0) {
    return <EmptyState icon={Boxes} title="Aucun compte" description="L'inventaire de vos comptes apparaîtra ici." />;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Total (comptes actifs) : <span className="font-mono font-semibold text-foreground">{formatAmount(total)}</span>
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Compte</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Devise</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Solde</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell className="font-medium">{account.name}</TableCell>
              <TableCell className="text-muted-foreground">{ACCOUNT_TYPE_LABELS[account.type]}</TableCell>
              <TableCell className="text-muted-foreground">{account.currency}</TableCell>
              <TableCell>
                <Badge variant={account.active ? "success" : "neutral"}>{account.active ? "Actif" : "Archivé"}</Badge>
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-mono tabular-nums",
                  account.balance < 0 ? "text-danger" : "text-foreground"
                )}
              >
                {formatAmount(account.balance)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
