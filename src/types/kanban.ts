export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface TaskCard {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  position: number;
}
