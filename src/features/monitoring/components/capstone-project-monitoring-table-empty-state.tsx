"use client";

import { IconFolderOpen } from "@tabler/icons-react";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface CapstoneProjectMonitoringTableEmptyStateProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function CapstoneProjectMonitoringTableEmptyState<TData extends RowData>({ table }: CapstoneProjectMonitoringTableEmptyStateProps<TData>) {
  const searchQuery = (table.getColumn("search")?.getFilterValue() as string) ?? "";
  const statusTimFilter = (table.getColumn("statusTim")?.getFilterValue() as string) ?? "";
  const statusProposalFilter = (table.getColumn("statusProposal")?.getFilterValue() as string) ?? "";
  const statusResumeFilter = (table.getColumn("statusResume")?.getFilterValue() as string) ?? "";

  const hasActiveFilter = searchQuery || statusTimFilter || statusProposalFilter || statusResumeFilter;

  return (
    <Empty>
      <EmptyHeader className="max-w-none">
        <EmptyMedia variant="icon">
          <IconFolderOpen />
        </EmptyMedia>
        <EmptyTitle>{hasActiveFilter ? "Mahasiswa Tidak Ditemukan" : "Tidak Ada Data Mahasiswa"}</EmptyTitle>
        <EmptyDescription>
          {searchQuery ? (
            <>
              Tidak ada mahasiswa dengan nama atau NIM <span className="font-medium">&ldquo;{searchQuery}&rdquo;</span>
            </>
          ) : statusTimFilter ? (
            <>
              Tidak ada mahasiswa dengan status tim <span className="font-medium">&ldquo;{statusTimFilter}&rdquo;</span>
            </>
          ) : statusProposalFilter ? (
            <>
              Tidak ada mahasiswa dengan status proposal <span className="font-medium">&ldquo;{statusProposalFilter}&rdquo;</span>
            </>
          ) : statusResumeFilter ? (
            <>
              Tidak ada mahasiswa dengan status resume <span className="font-medium">&ldquo;{statusResumeFilter}&rdquo;</span>
            </>
          ) : (
            "Semua progres capstone project mahasiswa akan ditampilkan disini"
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
