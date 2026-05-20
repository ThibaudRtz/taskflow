"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { reorderColumnsSchema } from "../validations/reorder.schema";

export async function reorderColumns(input: z.infer<typeof reorderColumnsSchema>) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const result = reorderColumnsSchema.safeParse(input);

  if (!result.success) {
    return { error: "Invalid input" };
  }

  const { boardId, items } = result.data;

  // Verify board ownership
  const board = await prisma.board.findUnique({
    where: {
      id: boardId,
      ownerId: session.user.id,
    },
    include: {
      workspace: { select: { slug: true } }
    }
  });

  if (!board) {
    return { error: "Unauthorized or board not found" };
  }

  try {
    const transactions = items.map((item) =>
      prisma.column.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    );

    await prisma.$transaction(transactions);

    revalidatePath(`/dashboard/${board.workspace.slug}/boards/${boardId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to reorder columns" };
  }
}