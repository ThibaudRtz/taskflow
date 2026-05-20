import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(50, "Workspace name must be 50 characters or less"),
});

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;
