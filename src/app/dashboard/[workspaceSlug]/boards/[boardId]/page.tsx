import { notFound } from "next/navigation";
import { KanbanSquare } from "lucide-react";

import { getWorkspaceBySlug } from "@/features/workspaces/queries/get-workspaces";
import { getBoardById } from "@/features/boards/queries/get-boards";
import { BoardSettings } from "@/features/boards/components/board-settings";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; boardId: string }>;
}) {
  const { workspaceSlug, boardId } = await params;

  const workspace = await getWorkspaceBySlug(workspaceSlug);
  if (!workspace) {
    notFound();
  }

  const board = await getBoardById(boardId, workspace.id);
  if (!board) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <KanbanSquare className="size-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">{board.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <BoardSettings
            key={board.id}
            boardId={board.id}
            boardTitle={board.title}
            workspaceSlug={workspace.slug}
            workspaceId={workspace.id}
          />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed text-center shadow-xs bg-muted/20">
        <div className="max-w-md space-y-2 p-8">
          <h3 className="text-xl font-semibold">Columns coming soon</h3>
          <p className="text-sm text-muted-foreground">
            This board is empty because columns and tasks are not implemented
            yet. The kanban drag-and-drop system will be integrated here.
          </p>
        </div>
      </div>
    </div>
  );
}
