"use client";

import React from "react";

import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { DataTableFeatures } from "./features";
import { Column, ReactTable, RowData } from "@tanstack/react-table";

const filterActiveClass =
  "border-sidebar-primary/40! bg-sidebar-primary/10! text-sidebar-primary hover:bg-sidebar-primary/10 hover:text-sidebar-primary aria-expanded:bg-sidebar-primary/10 aria-expanded:text-sidebar-primary";

export function getColumnFilterOptions<TData extends RowData, TValue = unknown>(
  column: Column<DataTableFeatures, TData, TValue> | undefined,
): string[] {
  return (column?.getFilterValue() as string[] | undefined) ?? [];
}

export function toggleColumnFilterOption<TData extends RowData, TValue = unknown>(
  column: Column<DataTableFeatures, TData, TValue>,
  option: string,
  checked: boolean,
) {
  const selected = getColumnFilterOptions(column);
  const next = checked ? [...selected, option] : selected.filter((value) => value !== option);

  column.setFilterValue(next.length > 0 ? next : undefined);
}

interface DataFilterDropdownProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
  columnId: string;
  label: string;
  icon?: React.ReactNode;
  options: string[];
  className?: string;
}

export function DataFilterDropdown<TData extends RowData>({ table, columnId, label, icon, options, className }: DataFilterDropdownProps<TData>) {
  const column = table.getColumn(columnId);
  const selected = getColumnFilterOptions(column);

  if (!column) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" className={cn(className, selected.length > 0 && filterActiveClass)} />}>
        {icon}
        <span>{label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option}
              checked={selected.includes(option)}
              onCheckedChange={(checked) => toggleColumnFilterOption(column, option, Boolean(checked))}
            >
              {option}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
