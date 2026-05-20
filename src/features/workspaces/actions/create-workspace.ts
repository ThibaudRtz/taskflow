"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createWorkspaceSchema } from "../validations/workspace.schema";

export async function createWorkspace(
  input: z.infer<typeof createWorkspaceSchema>,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const result = createWorkspaceSchema.safeParse(input);

  if (!result.success) {
    return { error: "Invalid input", issues: result.error.issues };
  }

  const { name } = result.data;

  // Generate base slug
  let slug = name
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) {
    slug = "workspace";
  }

  // Ensure slug uniqueness
  let uniqueSlug = slug;
  let counter = 1;
  while (true) {
    const existing = await prisma.workspace.findUnique({
      where: { slug: uniqueSlug },
    });

    if (!existing) {
      break;
    }

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  try {
    const workspace = await prisma.workspace.create({
      data: {
        name,
        slug: uniqueSlug,
        ownerId: session.user.id,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
      },
    };
  } catch (error) {
    return { error: "Failed to create workspace" };
  }
}
