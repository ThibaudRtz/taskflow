import { notFound } from "next/navigation";
import { KanbanSquare } from "lucide-react";

import { getWorkspaceBySlug } from "@/features/workspaces/queries/get-workspaces";
import { getBoardById } from "@/features/boards/queries/get-boards";
import { BoardSettings } from "@/features/boards/components/board-settings";
import { getColumnsByBoardId } from "@/features/columns/queries/get-columns";
import { ColumnList } from "@/features/columns/components/column-list";

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

  const columns = await getColumnsByBoardId(board.id, workspace.ownerId);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b pb-4 shrink-0">
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

      <div className="flex-1 -mx-4 overflow-hidden relative">
        <div className="absolute inset-0">
          <ColumnList boardId={board.id} columns={columns || []} />
        </div>
      </div>
    </div>
  );
}
