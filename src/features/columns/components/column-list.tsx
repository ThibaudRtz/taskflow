"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { ColumnCard } from "./column-card";
import { CreateColumnModal } from "./create-column-modal";

interface ColumnListProps {
  boardId: string;
  columns: Array<{
    id: string;
    title: string;
    order: number;
  }>;
}

export function ColumnList({ boardId, columns }: ColumnListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex h-full w-full overflow-x-auto p-4">
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

      <CreateColumnModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        boardId={boardId}
      />
    </div>
  );
}