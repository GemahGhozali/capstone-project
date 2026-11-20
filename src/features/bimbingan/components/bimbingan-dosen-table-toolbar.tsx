"use client";

import { IconNut } from "@tabler/icons-react";
import { ReactTable } from "@tanstack/react-table";
import { DataSearchBar } from "@/components/data/data-search-bar";
import { StatusBimbingan } from "@/generated/prisma/enums";
import { DataTableFeatures } from "@/components/data/features";
import { DataFilterDropdown } from "@/components/data/data-filter-dropdown";
import { BimbinganDosenPembimbing } from "../types";

interface BimbinganDosenTableToolbarProps {
  table: ReactTable<DataTableFeatures, BimbinganDosenPembimbing>;
}

export function BimbinganDosenTableToolbar({ table }: BimbinganDosenTableToolbarProps) {
  return (
    <div className="flex gap-3 max-sm:flex-col">
      <DataSearchBar table={table} placeholder="Cari NIM atau nama mahasiswa disini..." className="sm:max-w-96" />
      <DataFilterDropdown
        table={table}
        columnId="status"
        label="Status Bimbingan"
        icon={<IconNut data-icon="inline-start" />}
        options={Object.keys(StatusBimbingan)}
      />
    </div>
  );
}
