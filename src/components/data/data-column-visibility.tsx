"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { DataTableFeatures } from "./features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { IconAdjustments } from "@tabler/icons-react";

interface DataColumnVisibilityProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
  labels: Record<string, string>;
  className?: string;
}

export function DataColumnVisibility<TData extends RowData>({ table, labels, className }: DataColumnVisibilityProps<TData>) {
  const toggleableColumns = table.getAllLeafColumns().filter((column) => column.getCanHide() && labels[column.id]);

  if (toggleableColumns.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" className={className} />}>
        <IconAdjustments />
        <span>Kolom</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-[480px]:w-fit">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
          {toggleableColumns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(checked) => column.toggleVisibility(Boolean(checked))}
            >
              {labels[column.id]}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
