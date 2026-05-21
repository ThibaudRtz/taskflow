"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function reorderTasks(params: {
  boardId: string;
  items: { id: string; order: number; columnId: string }[];
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const { boardId, items } = params;

    // Verify user owns the board before proceeding
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
        ownerId: session.user.id,
      },
    });

    if (!board) {
      return { error: "Not found or unauthorized" };
    }

    // Bulk update tasks in a transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.task.update({
          where: { id: item.id },
          data: {
            order: item.order,
            columnId: item.columnId,
          },
        }),
      ),
    );

    revalidatePath(`/dashboard`);
    return { success: true };
  } catch (error) {
    console.error("[REORDER_TASKS]", error);
    return { error: "Failed to reorder tasks" };
  }
}
