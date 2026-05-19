"use server";

import { z } from "zod";

const createWorkspaceSchema = z.object({
  name: z.string().min(2).max(80),
});

export async function createWorkspace(input: unknown) {
  const payload = createWorkspaceSchema.parse(input);

  return {
    ok: true,
    workspace: {
      id: "stub-workspace-id",
      name: payload.name,
    },
  };
}
