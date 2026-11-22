"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconDownload } from "@tabler/icons-react";
import { DataSearchBar } from "@/components/data/data-search-bar";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { DataColumnVisibility } from "@/components/data/data-column-visibility";

const columnLabels: Record<string, string> = {
  kelas_nama: "Kelas",
  angkatan: "Angkatan",
  status: "Status",
  statusKuesioner: "Status Kuesioner",
  nilai: "Nilai",
};

interface PenilaianTableToolbarProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function PenilaianTableToolbar<TData extends RowData>({ table }: PenilaianTableToolbarProps<TData>) {
  return (
    <div className="flex gap-3 max-lg:flex-col">
      <DataSearchBar table={table} placeholder="Cari NIM atau nama mahasiswa disini..." className="lg:max-w-80" />
      <DataColumnVisibility table={table} labels={columnLabels} />
      <Link href="/kaprodi/penilaian-mahasiswa/import" className="lg:ml-auto">
        <Button variant="outline" className="max-lg:w-full">
          Import Nilai
          <IconDownload data-icon="inline-end" />
        </Button>
      </Link>
    </div>
  );
}
