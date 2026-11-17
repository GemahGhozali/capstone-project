"use client";

import React from "react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { DataTableFeatures } from "./features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { IconSearch } from "@tabler/icons-react";

interface DataSearchBarProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
  columnId?: string;
  placeholder?: string;
  className?: string;
}

export function DataSearchBar<TData extends RowData>({ table, columnId = "search", placeholder, className }: DataSearchBarProps<TData>) {
  const searchQuery = (table.getColumn(columnId)?.getFilterValue() as string) ?? "";

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    table.getColumn(columnId)?.setFilterValue(event.target.value);
  };

  return (
    <InputGroup className={className}>
      <InputGroupAddon align="inline-start">
        <IconSearch className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput placeholder={placeholder} value={searchQuery} onChange={handleSearch} />
    </InputGroup>
  );
}
