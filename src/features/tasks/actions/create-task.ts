"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "../validations/task.schema";

export async function createTask(input: z.infer<typeof createTaskSchema>) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const result = createTaskSchema.safeParse(input);

  if (!result.success) {
    return { error: "Invalid input" };
  }

  const { title, description, priority, columnId, dueDate } = result.data;

  // Validate column/board ownership
  const column = await prisma.column.findUnique({
    where: { id: columnId },
    include: {
      board: {
        include: { workspace: { select: { slug: true } } },
      },
    },
  });

  if (!column || column.board.ownerId !== session.user.id) {
    return { error: "Unauthorized or column not found" };
  }

  try {
    const lastTask = await prisma.task.findFirst({
      where: { columnId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastTask ? lastTask.order + 1 : 0;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        order: newOrder,
        columnId,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    revalidatePath(
      `/dashboard/${column.board.workspace.slug}/boards/${column.boardId}`,
    );
    return { success: true, task };
  } catch (error) {
    return { error: "Failed to create task" };
  }
}
