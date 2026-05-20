"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { CreateBoardModal } from "./create-board-modal";

interface Board {
  id: string;
  title: string;
}

interface BoardListProps {
  workspaces: Array<{
    id: string;
    slug: string;
    boards: Board[];
  }>;
}

export function BoardList({ workspaces }: BoardListProps) {
  const params = useParams<{ workspaceSlug?: string }>();
  const pathname = usePathname();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const slug = params?.workspaceSlug;
  if (!slug) return null;

  const activeWorkspace = workspaces.find((w) => w.slug === slug);
  if (!activeWorkspace) return null;

  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center justify-between px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span>Boards</span>
        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-md p-1 transition hover:bg-accent hover:text-accent-foreground"
          aria-label="Create board"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <div className="space-y-1">
        {activeWorkspace.boards.length === 0 ? (
          <p className="px-4 py-2 text-sm text-muted-foreground">
            No boards yet.
          </p>
        ) : (
          activeWorkspace.boards.map((board) => {
            const href = `/dashboard/${slug}/boards/${board.id}`;
            const isActive = pathname === href;

            return (
              <Link
                key={board.id}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                <div className="size-2 rounded-full bg-primary/40" />
                <span className="truncate">{board.title}</span>
              </Link>
            );
          })
        )}
      </div>

      <CreateBoardModal
        key={activeWorkspace.id}
        isOpen={showCreateModal}
        setIsOpen={setShowCreateModal}
        workspaceId={activeWorkspace.id}
        workspaceSlug={activeWorkspace.slug}
      />
    </div>
  );
}
