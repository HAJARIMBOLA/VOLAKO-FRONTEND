"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Account, Category } from "@/lib/types";

const ALL = "all";

export function TransactionFilters({ accounts, categories }: { accounts: Account[]; categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === ALL) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const hasFilters = ["accountId", "categoryId", "type", "from", "to"].some((key) => searchParams.get(key));

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-40 space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Type</label>
        <Select value={searchParams.get("type") ?? ALL} onValueChange={(v) => setParam("type", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Tous</SelectItem>
            <SelectItem value="INCOME">Revenus</SelectItem>
            <SelectItem value="EXPENSE">Dépenses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-48 space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Compte</label>
        <Select value={searchParams.get("accountId") ?? ALL} onValueChange={(v) => setParam("accountId", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Tous</SelectItem>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={String(account.id)}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-48 space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Catégorie</label>
        <Select value={searchParams.get("categoryId") ?? ALL} onValueChange={(v) => setParam("categoryId", v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Toutes</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-36 space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Du</label>
        <Input type="date" defaultValue={searchParams.get("from") ?? ""} onChange={(e) => setParam("from", e.target.value)} />
      </div>

      <div className="w-36 space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Au</label>
        <Input type="date" defaultValue={searchParams.get("to") ?? ""} onChange={(e) => setParam("to", e.target.value)} />
      </div>

      {hasFilters ? (
        <Button variant="ghost" size="sm" onClick={() => router.push(pathname)}>
          <X className="size-4" />
          Réinitialiser
        </Button>
      ) : null}
    </div>
  );
}
