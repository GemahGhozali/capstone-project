"use client";

import { IconNut } from "@tabler/icons-react";
import { ReactTable } from "@tanstack/react-table";
import { DataSearchBar } from "@/components/data/data-search-bar";
import { StatusProposal } from "@/generated/prisma/enums";
import { ProposalListItem } from "../types";
import { DataExportButton } from "@/components/data/data-export-button";
import { DataTableFeatures } from "@/components/data/features";
import { DataColumnVisibility } from "@/components/data/data-column-visibility";
import { ProposalTableSelectionBar } from "./proposal-table-selection-bar";
import { DataFilterDropdown, getColumnFilterOptions } from "@/components/data/data-filter-dropdown";

interface ProposalTableToolbarProps {
  table: ReactTable<DataTableFeatures, ProposalListItem>;
  showExport?: boolean;
}

const ColumnLabels: Record<string, string> = {
  namaTim: "Nama Tim",
  mitra: "Mitra",
  judul: "Judul",
  tanggalPengajuan: "Tanggal Pengajuan",
  status: "Status",
};

export function ProposalTableToolbar({ table, showExport = false }: ProposalTableToolbarProps) {
  const isSelectionActive = table.getSelectedRowModel().rows.length > 0;

  const params = new URLSearchParams();

  const selectedStatus = getColumnFilterOptions(table.getColumn("status"));
  selectedStatus.forEach((status) => params.append("status", status));

  const exportQuery = params.toString();
  const exportHref = `/api/export/proposal${exportQuery ? `?${exportQuery}` : ""}`;

  return (
    <div className="space-y-6">
      <div className="flex gap-3 max-lg:flex-col">
        <DataSearchBar table={table} placeholder="Cari nama tim, judul, atau mitra disini..." className="lg:max-w-96" />
        <DataColumnVisibility table={table} labels={ColumnLabels} />
        <DataFilterDropdown
          table={table}
          columnId="status"
          label="Status Proposal"
          icon={<IconNut data-icon="inline-start" />}
          options={Object.keys(StatusProposal)}
        />
        {showExport && <DataExportButton href={exportHref} className="lg:ml-auto" />}
      </div>
      {isSelectionActive && <ProposalTableSelectionBar table={table} />}
    </div>
  );
}
