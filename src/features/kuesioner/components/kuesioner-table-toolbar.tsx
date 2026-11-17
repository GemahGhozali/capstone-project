"use client";

import { Button } from "@/components/ui/button";
import { DataSearchBar } from "@/components/data/data-search-bar";
import { StatusKuesioner } from "@/generated/prisma/enums";
import { DataTableFeatures } from "@/components/data/features";
import { IconNut, IconPlus } from "@tabler/icons-react";
import { DataFilterDropdown } from "@/components/data/data-filter-dropdown";
import { ReactTable, RowData } from "@tanstack/react-table";

interface KuesionerTableToolbarProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
  onCreate: () => void;
}

export function KuesionerTableToolbar<TData extends RowData>({ table, onCreate }: KuesionerTableToolbarProps<TData>) {
  return (
    <div className="flex gap-3 max-lg:flex-col">
      <DataSearchBar table={table} placeholder="Cari judul atau deskripsi kuesioner disini..." className="xl:max-w-96 xl:shrink-0" />
      <DataFilterDropdown
        table={table}
        columnId="status"
        label="Status Kuesioner"
        icon={<IconNut data-icon="inline-start" />}
        options={Object.keys(StatusKuesioner)}
      />
      <Button className="lg:ml-auto" onClick={onCreate}>
        Tambah Kuesioner
        <IconPlus data-icon="inline-end" />
      </Button>
    </div>
  );
}
