"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function deleteBoard(id: string, workspaceId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  // Verify workspace ownership
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
      ownerId: session.user.id,
    },
    select: { slug: true },
  });

  if (!workspace) {
    return { error: "Unauthorized or workspace not found" };
  }

  try {
    await prisma.board.delete({
      where: {
        id,
        workspaceId,
      },
    });

    revalidatePath(`/dashboard/${workspace.slug}`);

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete board" };
  }
}
