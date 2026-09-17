import { redirect } from "next/navigation";
import { Wallet } from "lucide-react";
import { getCurrentUserPhoneNumber } from "@/lib/session-server";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const phoneNumber = await getCurrentUserPhoneNumber();
  if (!phoneNumber) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border md:flex md:flex-col">
          <div className="flex items-center gap-2 px-5 py-5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wallet className="size-4" />
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">VOLAKO</span>
          </div>
          <Sidebar />
        </aside>

        <div className="flex min-h-screen w-full min-w-0 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur md:px-8">
            <div className="flex items-center gap-2 md:hidden">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Wallet className="size-3.5" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-foreground">VOLAKO</span>
            </div>
            <div className="hidden md:block" />
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <UserMenu phoneNumber={phoneNumber} />
            </div>
          </header>

          <main className="flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10">{children}</main>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
