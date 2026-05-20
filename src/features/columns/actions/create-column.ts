"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createColumnSchema } from "../validations/column.schema";

export async function createColumn(input: z.infer<typeof createColumnSchema>) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const result = createColumnSchema.safeParse(input);

  if (!result.success) {
    return { error: "Invalid input", issues: result.error.issues };
  }

  const { title, boardId } = result.data;

  // Validate board ownership
  const board = await prisma.board.findUnique({
    where: {
      id: boardId,
      ownerId: session.user.id,
    },
    select: { id: true, workspace: { select: { slug: true } } },
  });

  if (!board) {
    return { error: "Unauthorized or board not found" };
  }

  try {
    // Find highest order to place the new column at the end
    const lastColumn = await prisma.column.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastColumn ? lastColumn.order + 1 : 0;

    const column = await prisma.column.create({
      data: {
        title,
        boardId,
        order: newOrder,
      },
    });

    revalidatePath(`/dashboard/${board.workspace.slug}/boards/${boardId}`);
    return { success: true, column };
  } catch (error) {
    console.error("CREATE_COLUMN_ERROR", error);
    return { error: "Failed to create column" };
  }
}
