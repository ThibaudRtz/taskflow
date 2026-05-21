"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function deleteTask(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  // Validate task ownership
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      column: {
        include: {
          board: {
            include: { workspace: { select: { slug: true } } },
          },
        },
      },
    },
  });

  if (!task || task.column.board.ownerId !== session.user.id) {
    return { error: "Unauthorized or task not found" };
  }

  try {
    await prisma.task.delete({
      where: { id },
    });

    revalidatePath(
      `/dashboard/${task.column.board.workspace.slug}/boards/${task.column.boardId}`,
    );
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete task" };
  }
}
