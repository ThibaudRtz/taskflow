"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function deleteWorkspace(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id },
  });

  if (!workspace || workspace.ownerId !== session.user.id) {
    return { error: "Unauthorized or workspace not found" };
  }

  try {
    // Hard delete for now, architecture prepared for soft delete
    await prisma.workspace.delete({
      where: { id },
    });

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete workspace" };
  }
}
