import Link from "next/link";
import { KanbanSquare, LayoutDashboard, Settings, Users } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/boards", label: "Boards", icon: KanbanSquare },
  { href: "/dashboard/workspace", label: "Workspace", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={cn("hidden h-screen w-64 shrink-0 border-r border-border bg-card/40 p-4 lg:block", className)}>
      <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary/90 text-primary-foreground">T</div>
        <span className="text-sm font-semibold tracking-wide">TaskFlow</span>
      </Link>
      <nav className="space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
