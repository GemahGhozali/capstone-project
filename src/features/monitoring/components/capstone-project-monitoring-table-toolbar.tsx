"use client";

import { DataSearchBar } from "@/components/data/data-search-bar";
import { DataExportButton } from "@/components/data/data-export-button";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { DataColumnVisibility } from "@/components/data/data-column-visibility";

const ColumnLabels: Record<string, string> = {
  kelas_nama: "Kelas",
  kelas_angkatan: "Angkatan",
  dosenPembimbing: "Dosen Pembimbing",
  statusTim: "Status Tim",
  statusProposal: "Status Proposal",
  statusResume: "Status Resume",
};

interface CapstoneProjectMonitoringTableToolbarProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function CapstoneProjectMonitoringTableToolbar<TData extends RowData>({ table }: CapstoneProjectMonitoringTableToolbarProps<TData>) {
  return (
    <div className="flex gap-3 max-md:flex-col">
      <DataSearchBar table={table} placeholder="Cari NIM atau nama mahasiswa disini..." className="md:max-w-80" />
      <DataColumnVisibility table={table} labels={ColumnLabels} />
      <DataExportButton href="/api/export/monitoring" className="md:ml-auto" />
    </div>
  );
}
