import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import {
  ColumnType,
  TaskType,
} from "@/features/columns/components/column-list";
import { reorderTasks } from "@/features/tasks/actions/reorder-tasks";

export function useBoardDnd(boardId: string, initialColumns: ColumnType[]) {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor),
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    // Dropping a Task over another Task
    if (isActiveTask && isOverTask) {
      setColumns((columns) => {
        const activeColumnId = active.data.current?.task.columnId;
        const overColumnId = over.data.current?.task.columnId;

        const activeColumnIndex = columns.findIndex(
          (col) => col.id === activeColumnId,
        );
        const overColumnIndex = columns.findIndex(
          (col) => col.id === overColumnId,
        );

        if (activeColumnIndex === -1 || overColumnIndex === -1) return columns;

        const activeColumn = columns[activeColumnIndex];
        const overColumn = columns[overColumnIndex];

        const activeTaskIndex = activeColumn.tasks.findIndex(
          (t) => t.id === activeId,
        );
        const overTaskIndex = overColumn.tasks.findIndex(
          (t) => t.id === overId,
        );

        // Within same column
        if (activeColumnId === overColumnId) {
          const newTasks = arrayMove(
            activeColumn.tasks,
            activeTaskIndex,
            overTaskIndex,
          );
          const newColumns = [...columns];
          newColumns[activeColumnIndex] = { ...activeColumn, tasks: newTasks };
          return newColumns;
        }

        // Across different columns
        const newColumns = [...columns];
        const activeTaskToMove = {
          ...activeColumn.tasks[activeTaskIndex],
          columnId: overColumn.id,
        };

        newColumns[activeColumnIndex] = {
          ...activeColumn,
          tasks: activeColumn.tasks.filter((t) => t.id !== activeId),
        };

        const newOverTasks = [...overColumn.tasks];
        newOverTasks.splice(overTaskIndex, 0, activeTaskToMove);

        newColumns[overColumnIndex] = {
          ...overColumn,
          tasks: newOverTasks,
        };

        // Update active data ref so moving continues seamlessly
        if (active.data.current) active.data.current.task = activeTaskToMove;

        return newColumns;
      });
    }

    // Dropping a Task over an empty Column
    if (isActiveTask && isOverColumn) {
      setColumns((columns) => {
        const activeColumnId = active.data.current?.task.columnId;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) return columns;

        const activeColumnIndex = columns.findIndex(
          (col) => col.id === activeColumnId,
        );
        const overColumnIndex = columns.findIndex(
          (col) => col.id === overColumnId,
        );

        if (activeColumnIndex === -1 || overColumnIndex === -1) return columns;

        const activeColumn = columns[activeColumnIndex];
        const overColumn = columns[overColumnIndex];

        const activeTaskIndex = activeColumn.tasks.findIndex(
          (t) => t.id === activeId,
        );

        const newColumns = [...columns];
        const activeTaskToMove = {
          ...activeColumn.tasks[activeTaskIndex],
          columnId: overColumnId as string,
        };

        newColumns[activeColumnIndex] = {
          ...activeColumn,
          tasks: activeColumn.tasks.filter((t) => t.id !== activeId),
        };

        newColumns[overColumnIndex] = {
          ...overColumn,
          tasks: [...overColumn.tasks, activeTaskToMove],
        };

        if (active.data.current) active.data.current.task = activeTaskToMove;

        return newColumns;
      });
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    // After state settles, diff with DB to see what actually changed
    // Local snapshot copy to avoid stale references in async
    const localColumnsSnapshot = [...columns];

    // Identify affected columns: columns where tasks have changed from initial state
    const affectedColumnIds = new Set<string>();

    localColumnsSnapshot.forEach((col) => {
      // If task length is different
      const initialCol = initialColumns.find((c) => c.id === col.id);
      if (!initialCol || initialCol.tasks.length !== col.tasks.length) {
        affectedColumnIds.add(col.id);
      }

      col.tasks.forEach((task, index) => {
        const globalTask = initialCol?.tasks.find((t) => t.id === task.id);
        const wasInOtherColumn = initialColumns.some(
          (c) => c.id !== col.id && c.tasks.some((t) => t.id === task.id),
        );

        if (wasInOtherColumn || !globalTask || globalTask.order !== index) {
          affectedColumnIds.add(col.id);
          // original column also affected if moved
          if (globalTask?.columnId && globalTask.columnId !== col.id) {
            affectedColumnIds.add(globalTask.columnId);
          }
        }
      });
    });

    const tasksToUpdate: { id: string; order: number; columnId: string }[] = [];

    localColumnsSnapshot.forEach((col) => {
      if (affectedColumnIds.has(col.id)) {
        col.tasks.forEach((task, index) => {
          tasksToUpdate.push({
            id: task.id,
            order: index, // 0-based to match array
            columnId: col.id,
          });
        });
      }
    });

    if (tasksToUpdate.length > 0) {
      try {
        const result = await reorderTasks({
          boardId,
          items: tasksToUpdate,
        });

        if (result.error) {
          toast.error("Failed to save layout.");
          setColumns(initialColumns); // rollback
        }
      } catch (err) {
        toast.error("Failed to reach server.");
        setColumns(initialColumns); // rollback
      }
    }
  };

  return {
    columns,
    activeTask,
    sensors,
    closestCorners,
    onDragStart,
    onDragOver,
    onDragEnd,
  };
}
