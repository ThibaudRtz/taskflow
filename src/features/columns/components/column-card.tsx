"use client";

import { ColumnSettings } from "./column-settings";

interface ColumnCardProps {
  column: {
    id: string;
    title: string;
    order: number;
  };
}

export function ColumnCard({ column }: ColumnCardProps) {
  return (
    <div className="flex h-full w-80 shrink-0 flex-col rounded-lg bg-muted/40 pb-2">
      <div className="flex items-center justify-between p-3 font-medium">
        <h3 className="truncate px-1 text-sm font-semibold">{column.title}</h3>
        <ColumnSettings columnId={column.id} columnTitle={column.title} />
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-2">
        {/* Tasks will go here later */}
        <div className="flex h-16 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
          Tasks coming soon
        </div>
      </div>
    </div>
  );
}