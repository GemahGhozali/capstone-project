"use client";

import { IconNut } from "@tabler/icons-react";
import { ReactTable } from "@tanstack/react-table";
import { StatusProposal } from "@/generated/prisma/enums";
import { DataSearchBar } from "@/components/data/data-search-bar";
import { ProposalListItem } from "../types";
import { DataTableFeatures } from "@/components/data/features";
import { DataFilterDropdown } from "@/components/data/data-filter-dropdown";
import { DataColumnVisibility } from "@/components/data/data-column-visibility";
import { ProposalTableSelectionBar } from "./proposal-table-selection-bar";

interface ProposalTableToolbarProps {
  table: ReactTable<DataTableFeatures, ProposalListItem>;
}

const ColumnLabels: Record<string, string> = {
  namaTim: "Nama Tim",
  mitra: "Mitra",
  judul: "Judul",
  tanggalPengajuan: "Tanggal Pengajuan",
  status: "Status",
};

export function ProposalTableToolbar({ table }: ProposalTableToolbarProps) {
  const isSelectionActive = table.getSelectedRowModel().rows.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex gap-3 max-sm:flex-col">
        <DataSearchBar table={table} placeholder="Cari nama tim, judul, atau mitra disini..." className="sm:max-w-96" />
        <DataColumnVisibility table={table} labels={ColumnLabels} />
        <DataFilterDropdown
          table={table}
          columnId="status"
          label="Status Proposal"
          icon={<IconNut data-icon="inline-start" />}
          options={Object.keys(StatusProposal)}
        />
      </div>
      {isSelectionActive && <ProposalTableSelectionBar table={table} />}
    </div>
  );
}
