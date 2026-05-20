import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getUserWorkspacesWithBoards() {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  const workspaces = await prisma.workspace.findMany({
    where: {
      ownerId: session.user.id,
    },
    include: {
      boards: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return workspaces;
}
