import type { Metadata } from "next";
import { Smartphone } from "lucide-react";
import { AccountTypeSection } from "@/components/accounts/account-type-section";

export const metadata: Metadata = { title: "Mobile Money — VOLAKO" };

export default function AccountsMobileMoneyPage() {
  return (
    <AccountTypeSection
      type="MOBILE_MONEY"
      icon={Smartphone}
      title="Mobile Money"
      description="Vos comptes mobile money — plusieurs numéros possibles (ex. 2 MVola)."
      emptyDescription="Créez votre premier compte mobile money (MVola, Airtel Money…)."
    />
  );
}
