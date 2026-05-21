"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TaskPriority } from "@prisma/client";

import { ColumnSettings } from "./column-settings";
import { TaskCard } from "@/features/tasks/components/task-card";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";
import { TaskModal } from "@/features/tasks/components/task-modal";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  dueDate: Date | null;
}

interface ColumnCardProps {
  column: {
    id: string;
    title: string;
    order: number;
    tasks?: Task[];
  };
}

export function ColumnCard({ column }: ColumnCardProps) {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col h-full shrink-0 w-80 rounded-lg bg-muted/40 pb-2">
        <div className="flex items-center justify-between p-3 font-medium cursor-grab active:cursor-grabbing">
          <h3 className="truncate px-1 text-sm font-semibold">
            {column.title}
          </h3>
          <ColumnSettings columnId={column.id} columnTitle={column.title} />
        </div>

        <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 min-h-[min-content]">
          {column.tasks?.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => handleTaskClick(task)}
            />
          ))}

          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground shrink-0 mt-1"
            size="sm"
            onClick={() => setIsCreateTaskOpen(true)}
          >
            <Plus className="mr-2 size-4" />
            Add task
          </Button>
        </div>
      </div>

      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        setIsOpen={setIsCreateTaskOpen}
        columnId={column.id}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        setIsOpen={setIsTaskModalOpen}
        task={selectedTask}
      />
    </>
  );
}
