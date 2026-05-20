import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getUserWorkspaces() {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const workspaces = await prisma.workspace.findMany({
    where: {
      ownerId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return workspaces;
}

export async function getWorkspaceBySlug(slug: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const workspace = await prisma.workspace.findUnique({
    where: {
      slug,
      ownerId: session.user.id,
    },
  });

  return workspace;
}
