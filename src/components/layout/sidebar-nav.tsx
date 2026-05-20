"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { KanbanSquare, LayoutDashboard, Settings } from "lucide-react";

import { cn } from "@/lib/utils";

export function SidebarNav() {
  const params = useParams<{ workspaceSlug?: string }>();
  const pathname = usePathname();
  const slug = params?.workspaceSlug || "";

  // If no slug, maybe we are at root /dashboard or settings
  const basePath = slug ? `/dashboard/${slug}` : "/dashboard";

  const navItems = [
    { href: basePath, label: "Overview", icon: LayoutDashboard },
    { href: `${basePath}/settings`, label: "Settings", icon: Settings },
  ];

  return (
    <nav className="space-y-1">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition hover:bg-accent hover:text-accent-foreground",
              isActive
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
