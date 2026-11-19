"use client";

import { ReactTable } from "@tanstack/react-table";
import { DataSearchBar } from "@/components/data/data-search-bar";
import { DataTableFeatures } from "@/components/data/features";
import { DataColumnVisibility } from "@/components/data/data-column-visibility";
import { BimbinganMahasiswaMonitoring } from "../types";

interface BimbinganMonitoringTableToolbarProps {
  table: ReactTable<DataTableFeatures, BimbinganMahasiswaMonitoring>;
}

const ColumnLabels: Record<string, string> = {
  namaLengkap: "Mahasiswa",
  subjudul: "Subjudul Resume",
  dosenPembimbing: "Dosen Pembimbing",
  totalBimbinganTerverifikasi: "Total Bimbingan Terverifikasi",
};

export function BimbinganMonitoringTableToolbar({ table }: BimbinganMonitoringTableToolbarProps) {
  return (
    <div className="flex gap-3 max-sm:flex-col">
      <DataSearchBar table={table} placeholder="Cari nama, NIM, atau resume mahasiswa disini..." className="sm:max-w-96" />
      <DataColumnVisibility table={table} labels={ColumnLabels} />
    </div>
  );
}
