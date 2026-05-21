import { z } from "zod";
import { TaskPriority } from "@prisma/client";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().optional(),
  priority: z.nativeEnum(TaskPriority),
  columnId: z.string().min(1, "Column is required"),
  dueDate: z.string().optional().nullable(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  id: z.string().min(1, "Task ID is required"),
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().optional().nullable(),
  priority: z.nativeEnum(TaskPriority),
  dueDate: z.string().optional().nullable(),
});

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;

export const deleteTaskSchema = z.object({
  id: z.string().min(1, "Task ID is required"),
});

export type DeleteTaskSchema = z.infer<typeof deleteTaskSchema>;
