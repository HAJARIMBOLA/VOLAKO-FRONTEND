import { redirect } from "next/navigation";
import { getCurrentUserPhoneNumber } from "@/lib/session-server";
import { AppShell } from "@/components/layout/app-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const phoneNumber = await getCurrentUserPhoneNumber();
  if (!phoneNumber) {
    redirect("/login");
  }

  return <AppShell phoneNumber={phoneNumber}>{children}</AppShell>;
}
