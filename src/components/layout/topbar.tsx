import { auth } from "@/auth";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserButton } from "@/features/auth/user-button";

export async function Topbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur lg:px-8">
      <div>
        <h1 className="text-sm font-semibold lg:text-base">Dashboard</h1>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserButton session={session} />
      </div>
    </header>
  );
}
