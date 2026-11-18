"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactTable } from "@tanstack/react-table";
import { DataSearchBar } from "@/components/data/data-search-bar";
import { StatusMahasiswa } from "@/generated/prisma/enums";
import { IconNut, IconPlus } from "@tabler/icons-react";
import { DataTableFeatures } from "@/components/data/features";
import { MahasiswaOverview } from "../types";
import { DataFilterDropdown } from "@/components/data/data-filter-dropdown";
import { MahasiswaTableSelectionBar } from "./mahasiswa-table-selection-bar";

interface MahasiswaTableToolbarProps {
  table: ReactTable<DataTableFeatures, MahasiswaOverview>;
}

export function MahasiswaTableToolbar({ table }: MahasiswaTableToolbarProps) {
  const isSelectionActive = table.getSelectedRowModel().rows.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex gap-3 max-lg:flex-col">
        <DataSearchBar table={table} placeholder="Cari NIM atau nama mahasiswa disini..." className="lg:max-w-80" />
        <DataFilterDropdown
          table={table}
          columnId="status"
          label="Status Mahasiswa"
          icon={<IconNut data-icon="inline-start" />}
          options={Object.keys(StatusMahasiswa)}
        />
        <Link href="/kaprodi/daftar-mahasiswa/tambah" className="lg:ml-auto">
          <Button className="max-lg:w-full">
            Tambah Mahasiswa <IconPlus data-icon="inline-end" />
          </Button>
        </Link>
      </div>
      {isSelectionActive && <MahasiswaTableSelectionBar table={table} />}
    </div>
  );
}
