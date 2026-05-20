import Link from "next/link";
import { notFound } from "next/navigation";
import { KanbanSquare } from "lucide-react";

import { getWorkspaceBySlug } from "@/features/workspaces/queries/get-workspaces";
import { getBoardsByWorkspace } from "@/features/boards/queries/get-boards";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ workspaceSlug: string }>;
}) {
  const { workspaceSlug } = await params;
  const workspace = await getWorkspaceBySlug(workspaceSlug);

  if (!workspace) {
    notFound();
  }

  const boards = await getBoardsByWorkspace(workspace.id);

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {workspace.name} Overview
          </h2>
          <p className="border-b pb-4 text-sm text-muted-foreground">
            Manage your workspace boards and settings
          </p>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Recent Boards</h3>
        {boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-muted/20">
            <h4 className="mb-2 font-medium">No boards found</h4>
            <p className="text-sm text-muted-foreground">
              Create a new board from the sidebar to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <Link
                key={board.id}
                href={`/dashboard/${workspace.slug}/boards/${board.id}`}
                className="group flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <KanbanSquare className="size-5 text-primary/60 group-hover:text-primary transition-colors" />
                  <h4 className="font-medium">{board.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
