import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getBoardsByWorkspace(workspaceId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  // We need to verify that this user is the owner or a member of the workspace
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
      ownerId: session.user.id,
    },
    select: { id: true },
  });

  if (!workspace) {
    return [];
  }

  const boards = await prisma.board.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      position: "asc",
    },
  });

  return boards;
}

export async function getBoardById(boardId: string, workspaceId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
      ownerId: session.user.id,
    },
    select: { id: true },
  });

  if (!workspace) {
    return null;
  }

  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      workspaceId,
    },
  });

  return board;
}
