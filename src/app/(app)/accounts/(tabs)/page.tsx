import type { Metadata } from "next";
import { Banknote } from "lucide-react";
import { AccountTypeSection } from "@/components/accounts/account-type-section";

export const metadata: Metadata = { title: "Cash — VOLAKO" };

export default function AccountsCashPage() {
  return (
    <AccountTypeSection
      type="CASH"
      icon={Banknote}
      emptyDescription="Créez votre premier compte cash pour suivre votre liquide."
    />
  );
}
