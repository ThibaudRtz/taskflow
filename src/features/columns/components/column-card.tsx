"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { ColumnSettings } from "./column-settings";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";
import { TaskModal } from "@/features/tasks/components/task-modal";
import { Button } from "@/components/ui/button";

import type { ColumnType, TaskType } from "./column-list";
import { SortableTask } from "@/features/tasks/dnd/components/sortable-task";

interface ColumnCardProps {
  column: ColumnType;
}

export function ColumnCard({ column }: ColumnCardProps) {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const handleTaskClick = (task: TaskType) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const tasksIds = column.tasks.map((task) => task.id);

  return (
    <>
      <div className="flex flex-col h-full shrink-0 w-80 rounded-lg bg-muted/40 pb-2">
        <div className="flex items-center justify-between p-3 font-medium">
          <h3 className="truncate px-1 text-sm font-semibold">
            {column.title}
          </h3>
          <ColumnSettings columnId={column.id} columnTitle={column.title} />
        </div>

        <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 min-h-[min-content]">
          <SortableContext
            items={tasksIds}
            strategy={verticalListSortingStrategy}
          >
            <div
              ref={setNodeRef}
              className="flex flex-col gap-2 min-h-[2px] flex-1"
            >
              {column.tasks.map((task) => (
                <SortableTask
                  key={task.id}
                  task={task}
                  onClick={() => handleTaskClick(task)}
                />
              ))}
            </div>
          </SortableContext>

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
        task={selectedTask as any}
      />
    </>
  );
}
