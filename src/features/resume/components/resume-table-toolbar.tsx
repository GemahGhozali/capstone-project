"use client";

import { IconNut } from "@tabler/icons-react";
import { ReactTable } from "@tanstack/react-table";
import { StatusResume } from "@/generated/prisma/enums";
import { DataSearchBar } from "@/components/data/data-search-bar";
import { ResumeListItem } from "../types";
import { DataTableFeatures } from "@/components/data/features";
import { DataExportButton } from "@/components/data/data-export-button";
import { DataColumnVisibility } from "@/components/data/data-column-visibility";
import { ResumeTableSelectionBar } from "./resume-table-selection-bar";
import { DataFilterDropdown, getColumnFilterOptions } from "@/components/data/data-filter-dropdown";

interface ResumeTableToolbarProps {
  table: ReactTable<DataTableFeatures, ResumeListItem>;
  showExport?: boolean;
}

const ColumnLabels: Record<string, string> = {
  namaMahasiswa: "Mahasiswa",
  mitra: "Mitra",
  subjudul: "Subjudul",
  tanggalPengajuan: "Tanggal Pengajuan",
  dosenPembimbing: "Dosen Pembimbing",
  status: "Status",
};

export function ResumeTableToolbar({ table, showExport = false }: ResumeTableToolbarProps) {
  const isSelectionActive = table.getSelectedRowModel().rows.length > 0;

  const params = new URLSearchParams();

  const selectedStatus = getColumnFilterOptions(table.getColumn("status"));
  selectedStatus.forEach((status) => params.append("status", status));

  const exportQuery = params.toString();
  const exportHref = `/api/export/resume${exportQuery ? `?${exportQuery}` : ""}`;

  return (
    <div className="space-y-6">
      <div className="flex gap-3 max-lg:flex-col">
        <DataSearchBar table={table} placeholder="Cari NIM, nama, subjudul, atau mitra disini..." className="lg:max-w-96" />
        <DataColumnVisibility table={table} labels={ColumnLabels} />
        <DataFilterDropdown
          table={table}
          columnId="status"
          label="Status Resume"
          icon={<IconNut data-icon="inline-start" />}
          options={Object.keys(StatusResume)}
        />
        {showExport && <DataExportButton href={exportHref} className="lg:ml-auto" />}
      </div>
      {isSelectionActive && <ResumeTableSelectionBar table={table} />}
    </div>
  );
}
