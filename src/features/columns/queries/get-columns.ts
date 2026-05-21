import { prisma } from "@/lib/prisma";

export async function getColumnsByBoardId(boardId: string, ownerId: string) {
  try {
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
        ownerId: ownerId,
      },
      include: {
        columns: {
          orderBy: {
            order: "asc",
          },
          include: {
            tasks: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    if (!board) return null;

    return board.columns;
  } catch (error) {
    return null;
  }
}
