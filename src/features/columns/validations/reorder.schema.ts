import { z } from "zod";

export const reorderColumnsSchema = z.object({
  boardId: z.string().min(1),
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
    }),
  ),
});

export type ReorderColumnsSchema = z.infer<typeof reorderColumnsSchema>;
