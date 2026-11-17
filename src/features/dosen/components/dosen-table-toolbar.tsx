"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactTable } from "@tanstack/react-table";
import { StatusDosen } from "@/generated/prisma/enums";
import { DosenOverview } from "../types";
import { DataSearchBar } from "@/components/data/data-search-bar";
import { DataTableFeatures } from "@/components/data/features";
import { DataFilterDropdown } from "@/components/data/data-filter-dropdown";
import { DosenTableSelectionBar } from "./dosen-table-selection-bar";
import { IconBadge, IconNut, IconPlus } from "@tabler/icons-react";

interface DosenTableToolbarProps {
  table: ReactTable<DataTableFeatures, DosenOverview>;
}

export function DosenTableToolbar({ table }: DosenTableToolbarProps) {
  const isSelectionActive = table.getSelectedRowModel().rows.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex gap-3 max-sm:flex-col">
        <DataSearchBar table={table} placeholder="Cari NIP atau nama dosen disini..." className="xl:max-w-80 xl:shrink-0" />
        <div className="flex gap-3 max-sm:*:grow">
          <DataFilterDropdown
            table={table}
            columnId="status"
            label="Status Dosen"
            icon={<IconNut data-icon="inline-start" />}
            options={Object.keys(StatusDosen)}
          />
          <DataFilterDropdown
            table={table}
            columnId="role"
            label="Role Dosen"
            icon={<IconBadge data-icon="inline-start" />}
            options={["Dosen Capstone Project", "Dosen Pembimbing", "Kaprodi"]}
          />
        </div>
        <Link href="/kaprodi/daftar-dosen/tambah" className="sm:ml-auto">
          <Button className="max-sm:w-full">
            Tambah Dosen <IconPlus data-icon="inline-end" />
          </Button>
        </Link>
      </div>
      {isSelectionActive && <DosenTableSelectionBar table={table} />}
    </div>
  );
}
