"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { renameColumnSchema } from "../validations/column.schema";

export async function renameColumn(input: z.infer<typeof renameColumnSchema>) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const result = renameColumnSchema.safeParse(input);

  if (!result.success) {
    return { error: "Invalid input" };
  }

  const { id, title } = result.data;

  // Verify column membership to an owned board
  const column = await prisma.column.findUnique({
    where: { id },
    include: {
      board: {
        include: {
          workspace: { select: { slug: true } },
        },
      },
    },
  });

  if (!column || column.board.ownerId !== session.user.id) {
    return { error: "Unauthorized or column not found" };
  }

  try {
    await prisma.column.update({
      where: { id },
      data: { title },
    });

    revalidatePath(
      `/dashboard/${column.board.workspace.slug}/boards/${column.boardId}`,
    );
    return { success: true };
  } catch (error) {
    return { error: "Failed to rename column" };
  }
}
