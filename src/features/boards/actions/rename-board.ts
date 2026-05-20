"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { renameBoardSchema } from "../validations/board.schema";

export async function renameBoard(input: z.infer<typeof renameBoardSchema>) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const result = renameBoardSchema.safeParse(input);

  if (!result.success) {
    return { error: "Invalid input", issues: result.error.issues };
  }

  const { id, title, workspaceId } = result.data;

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
    const board = await prisma.board.update({
      where: {
        id,
        workspaceId,
      },
      data: {
        title,
      },
    });

    revalidatePath(`/dashboard/${workspace.slug}`);
    revalidatePath(`/dashboard/${workspace.slug}/boards/${board.id}`);

    return { success: true, board };
  } catch (error) {
    return { error: "Failed to rename board" };
  }
}
