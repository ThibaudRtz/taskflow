import { z } from "zod";

export const createBoardSchema = z.object({
  title: z
    .string()
    .min(1, "Board title is required")
    .max(80, "Board title must be 80 characters or less"),
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

export type CreateBoardSchema = z.infer<typeof createBoardSchema>;

export const renameBoardSchema = z.object({
  id: z.string().min(1, "Board ID is required"),
  title: z
    .string()
    .min(1, "Board title is required")
    .max(80, "Board title must be 80 characters or less"),
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

export type RenameBoardSchema = z.infer<typeof renameBoardSchema>;
