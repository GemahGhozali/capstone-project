"use client";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { DataSearchBar } from "@/components/data/data-search-bar";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";

interface ProdiTableToolbarProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
  onTambah: () => void;
}

export function ProdiTableToolbar<TData extends RowData>({ table, onTambah }: ProdiTableToolbarProps<TData>) {
  return (
    <div className="flex gap-3 max-sm:flex-col">
      <DataSearchBar table={table} columnId="nama" placeholder="Cari nama prodi disini..." className="sm:max-w-80 xl:shrink-0" />
      <Button className={cn("sm:ml-auto max-sm:w-full")} onClick={onTambah}>
        Tambah Prodi <IconPlus data-icon="inline-end" />
      </Button>
    </div>
  );
}
