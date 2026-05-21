"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateTaskSchema } from "../validations/task.schema";

export async function updateTask(input: z.infer<typeof updateTaskSchema>) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const result = updateTaskSchema.safeParse(input);

  if (!result.success) {
    return { error: "Invalid input" };
  }

  const { id, title, description, priority, dueDate } = result.data;

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
    await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    revalidatePath(
      `/dashboard/${task.column.board.workspace.slug}/boards/${task.column.boardId}`,
    );
    return { success: true };
  } catch (error) {
    return { error: "Failed to update task" };
  }
}
