"use client";

import { TaskPriority } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    priority: TaskPriority;
    dueDate: Date | null;
  };
  onClick: () => void;
}

const priorityConfig = {
  [TaskPriority.LOW]: {
    label: "Low",
    color:
      "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 shadow-none border-0",
  },
  [TaskPriority.MEDIUM]: {
    label: "Medium",
    color:
      "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 shadow-none border-0",
  },
  [TaskPriority.HIGH]: {
    label: "High",
    color:
      "bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-none border-0",
  },
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const isOverdue = task.dueDate && new Date() > new Date(task.dueDate);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="group relative flex cursor-pointer flex-col gap-2 rounded-md border bg-card p-3 text-sm shadow-sm transition hover:border-primary/50 hover:shadow-md outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium leading-none">{task.title}</h4>
      </div>

      {task.description && (
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {task.description}
        </p>
      )}

      <div className="mt-1 flex items-center gap-2">
        <Badge
          variant="secondary"
          className={`text-[10px] font-normal rounded-sm px-1.5 py-0 ${priorityConfig[task.priority].color}`}
        >
          {priorityConfig[task.priority].label}
        </Badge>

        {task.dueDate && (
          <div
            className={`flex items-center gap-1 text-[10px] ${isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}`}
          >
            <CalendarIcon className="size-3" />
            <span>{format(new Date(task.dueDate), "MMM d")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
