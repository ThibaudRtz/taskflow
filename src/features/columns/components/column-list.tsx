"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";

import { ColumnCard } from "./column-card";
import { CreateColumnModal } from "./create-column-modal";
import { TaskPriority } from "@prisma/client";
import { useBoardDnd } from "@/features/tasks/dnd/hooks/use-board-dnd";
import { TaskCard } from "@/features/tasks/components/task-card";

export type ColumnType = {
  id: string;
  title: string;
  order: number;
  tasks: TaskType[];
};

export type TaskType = {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  dueDate: Date | null;
  order: number;
  columnId: string;
};

interface ColumnListProps {
  boardId: string;
  columns: ColumnType[];
}

export function ColumnList({
  boardId,
  columns: initialColumns,
}: ColumnListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    columns,
    activeTask,
    sensors,
    closestCorners,
    onDragStart,
    onDragOver,
    onDragEnd,
  } = useBoardDnd(boardId, initialColumns);

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.5" } },
    }),
  };

  return (
    <div className="flex h-full w-full overflow-x-auto p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex h-full items-start gap-4">
          {columns.map((column) => (
            <ColumnCard key={column.id} column={column} />
          ))}

          <div className="w-80 shrink-0">
            <Button
              variant="ghost"
              className="w-full justify-start border border-dashed bg-muted/20 text-muted-foreground hover:bg-muted/50"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="mr-2 size-4" />
              Add new column
            </Button>
          </div>
        </div>

        {/* Render a Drag Overlay to make movements smooth visually */}
        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? (
            <TaskCard task={activeTask} onClick={() => {}} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <CreateColumnModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        boardId={boardId}
      />
    </div>
  );
}
