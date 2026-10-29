"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

interface KelasTableToolbarProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
  onTambah: () => void;
}

export function KelasTableToolbar<TData extends RowData>({ table, onTambah }: KelasTableToolbarProps<TData>) {
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
        <InputGroupInput placeholder="Cari nama kelas disini..." value={searchQuery} onChange={handleSearch} />
      </InputGroup>
      <Button className="sm:ml-auto max-sm:w-full" onClick={onTambah}>
        Tambah Kelas <IconPlus data-icon="inline-end" />
      </Button>
    </div>
  );
}
