import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { AccountTypeSection } from "@/components/accounts/account-type-section";

export const metadata: Metadata = { title: "Banque — VOLAKO" };

export default function AccountsBankPage() {
  return (
    <AccountTypeSection
      type="BANK"
      icon={Building2}
      emptyDescription="Créez votre premier compte bancaire pour suivre vos comptes en banque."
    />
  );
}
