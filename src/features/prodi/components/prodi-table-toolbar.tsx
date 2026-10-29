"use client";

import React from "react";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

interface ProdiTableToolbarProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
  onTambah: () => void;
}

export function ProdiTableToolbar<TData extends RowData>({ table, onTambah }: ProdiTableToolbarProps<TData>) {
  const searchQuery = (table.getColumn("nama")?.getFilterValue() as string) ?? "";

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    table.getColumn("nama")?.setFilterValue(event.target.value);
  };

  return (
    <div className="flex gap-3 max-sm:flex-col">
      <InputGroup className="sm:max-w-80">
        <InputGroupAddon align="inline-start">
          <IconSearch className="text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Cari nama prodi disini..." value={searchQuery} onChange={handleSearch} />
      </InputGroup>
      <Button className={cn("sm:ml-auto max-sm:w-full")} onClick={onTambah}>
        Tambah Prodi <IconPlus data-icon="inline-end" />
      </Button>
    </div>
  );
}
