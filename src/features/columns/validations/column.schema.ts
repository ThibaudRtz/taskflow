import { z } from "zod";

export const createColumnSchema = z.object({
  title: z.string().min(1, "Title is required").max(60, "Title is too long"),
  boardId: z.string().min(1, "Board is required"),
});

export type CreateColumnSchema = z.infer<typeof createColumnSchema>;

export const renameColumnSchema = z.object({
  id: z.string().min(1, "Column ID is required"),
  title: z.string().min(1, "Title is required").max(60, "Title is too long"),
});

export type RenameColumnSchema = z.infer<typeof renameColumnSchema>;

export const deleteColumnSchema = z.object({
  id: z.string().min(1, "Column ID is required"),
});

export type DeleteColumnSchema = z.infer<typeof deleteColumnSchema>;
