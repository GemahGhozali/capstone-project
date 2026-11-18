"use client";

import { IconNut } from "@tabler/icons-react";
import { ReactTable } from "@tanstack/react-table";
import { StatusResume } from "@/generated/prisma/enums";
import { DataSearchBar } from "@/components/data/data-search-bar";
import { ResumeListItem } from "../types";
import { DataTableFeatures } from "@/components/data/features";
import { DataFilterDropdown } from "@/components/data/data-filter-dropdown";
import { DataColumnVisibility } from "@/components/data/data-column-visibility";
import { ResumeTableSelectionBar } from "./resume-table-selection-bar";

interface ResumeTableToolbarProps {
  table: ReactTable<DataTableFeatures, ResumeListItem>;
}

const ColumnLabels: Record<string, string> = {
  namaMahasiswa: "Mahasiswa",
  mitra: "Mitra",
  subjudul: "Subjudul",
  tanggalPengajuan: "Tanggal Pengajuan",
  dosenPembimbing: "Dosen Pembimbing",
  status: "Status",
};

export function ResumeTableToolbar({ table }: ResumeTableToolbarProps) {
  const isSelectionActive = table.getSelectedRowModel().rows.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex gap-3 max-sm:flex-col">
        <DataSearchBar table={table} placeholder="Cari NIM, nama, subjudul, atau mitra disini..." className="sm:max-w-96" />
        <DataColumnVisibility table={table} labels={ColumnLabels} />
        <DataFilterDropdown
          table={table}
          columnId="status"
          label="Status Resume"
          icon={<IconNut data-icon="inline-start" />}
          options={Object.keys(StatusResume)}
        />
      </div>
      {isSelectionActive && <ResumeTableSelectionBar table={table} />}
    </div>
  );
}
