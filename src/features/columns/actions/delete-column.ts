"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function deleteColumn(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  // Verify column membership to an owned board
  const column = await prisma.column.findUnique({
    where: { id },
    include: {
      board: {
        include: {
          workspace: { select: { slug: true } }
        }
      }
    },
  });

  if (!column || column.board.ownerId !== session.user.id) {
    return { error: "Unauthorized or column not found" };
  }

  try {
    await prisma.column.delete({
      where: { id },
    });

    revalidatePath(`/dashboard/${column.board.workspace.slug}/boards/${column.boardId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete column" };
  }
}
