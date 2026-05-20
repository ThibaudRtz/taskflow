"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createBoardSchema } from "../validations/board.schema";

export async function createBoard(input: z.infer<typeof createBoardSchema>) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const result = createBoardSchema.safeParse(input);

  if (!result.success) {
    return { error: "Invalid input", issues: result.error.issues };
  }

  const { title, workspaceId } = result.data;

  // Verify workspace ownership
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
      ownerId: session.user.id,
    },
    select: { id: true, slug: true },
  });

  if (!workspace) {
    return { error: "Unauthorized or workspace not found" };
  }

  try {
    // Find highest position
    const lastBoard = await prisma.board.findFirst({
      where: { workspaceId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const newPosition = lastBoard ? lastBoard.position + 1024 : 1024;

    const board = await prisma.board.create({
      data: {
        title,
        workspaceId,
        ownerId: session.user.id,
        position: newPosition,
      },
    });

    revalidatePath(`/dashboard/${workspace.slug}`);

    return {
      success: true,
      board: {
        id: board.id,
        title: board.title,
      },
    };
  } catch (error) {
    return { error: "Failed to create board" };
  }
}
