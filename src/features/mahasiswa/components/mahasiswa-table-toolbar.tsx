"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactTable } from "@tanstack/react-table";
import { DataSearchBar } from "@/components/data/data-search-bar";
import { StatusMahasiswa } from "@/generated/prisma/enums";
import { IconDownload, IconNut, IconPlus } from "@tabler/icons-react";
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
        <div className="flex gap-3 max-lg:flex-col lg:ml-auto">
          <Link href="/kaprodi/daftar-mahasiswa/import">
            <Button variant="outline" className="max-lg:w-full">
              Import Mahasiswa
              <IconDownload data-icon="inline-end" />
            </Button>
          </Link>
          <Link href="/kaprodi/daftar-mahasiswa/tambah">
            <Button className="max-lg:w-full">
              Tambah Mahasiswa <IconPlus data-icon="inline-end" />
            </Button>
          </Link>
        </div>
      </div>
      {isSelectionActive && <MahasiswaTableSelectionBar table={table} />}
    </div>
  );
}
