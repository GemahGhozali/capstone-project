"use client";

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
import { IconFilter2 } from "@tabler/icons-react";
import { DataTableFeatures } from "./features";
import { toggleColumnFilterOption } from "./data-filter-dropdown";
import { Column, RowData, Subscribe } from "@tanstack/react-table";

interface DataColumnFilterProps<TData extends RowData, TValue = unknown> {
  column: Column<DataTableFeatures, TData, TValue>;
  title: string;
  options: string[];
  className?: string;
}

export function DataColumnFilter<TData extends RowData, TValue = unknown>({
  column,
  title,
  options,
  className,
}: DataColumnFilterProps<TData, TValue>) {
  if (!column.getCanFilter()) {
    return <span className={className}>{title}</span>;
  }

  return (
    <Subscribe
      source={column.table.store}
      selector={(state) => {
        const filter = state.columnFilters.find((columnFilter) => columnFilter.id === column.id);
        return (filter?.value as string[] | undefined) ?? [];
      }}
    >
      {(selected) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant={selected.length > 0 ? "outline" : "ghost"} size="sm" className={cn("-mx-2", className)}>
                <span>{title}</span>
                <IconFilter2 />
              </Button>
            }
          />
          <DropdownMenuContent className="w-fit">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{title}</DropdownMenuLabel>
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
      )}
    </Subscribe>
  );
}
