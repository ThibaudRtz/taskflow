import Link from "next/link";
import { cn } from "@/lib/utils";
import { getUserWorkspaces } from "@/features/workspaces/queries/get-workspaces";
import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher";
import { SidebarNav } from "./sidebar-nav";

export async function Sidebar({ className }: { className?: string }) {
  const workspaces = await getUserWorkspaces();

  return (
    <aside
      className={cn(
        "hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card/40 p-4 lg:flex",
        className,
      )}
    >
      <Link href="/dashboard" className="mb-6 flex items-center gap-2 px-2">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary/90 text-primary-foreground">
          T
        </div>
        <span className="text-sm font-semibold tracking-wide">TaskFlow</span>
      </Link>

      <div className="mb-6">
        <WorkspaceSwitcher workspaces={workspaces} />
      </div>

      <SidebarNav />
    </aside>
  );
}
