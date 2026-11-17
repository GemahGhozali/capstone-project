"use client";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { DataTableFeatures } from "./features";
import { Column, RowData, Subscribe } from "@tanstack/react-table";
import { IconArrowDown, IconArrowUp, IconArrowsSort } from "@tabler/icons-react";

interface DataColumnSortProps<TData extends RowData, TValue = unknown> {
  column: Column<DataTableFeatures, TData, TValue>;
  title: string;
  className?: string;
}

export function DataColumnSort<TData extends RowData, TValue = unknown>({ column, title, className }: DataColumnSortProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className={className}>{title}</span>;
  }

  return (
    <Subscribe
      source={column.table.store}
      selector={(state) => {
        const entry = state.sorting.find((columnSort) => columnSort.id === column.id);
        return !entry ? false : entry.desc ? "desc" : "asc";
      }}
    >
      {(isSorted) => (
        <Button variant="ghost" size="sm" className={cn("-mx-2", className)} onClick={() => column.toggleSorting()}>
          <span>{title}</span>
          {isSorted === "asc" ? <IconArrowUp /> : isSorted === "desc" ? <IconArrowDown /> : <IconArrowsSort />}
        </Button>
      )}
    </Subscribe>
  );
}
