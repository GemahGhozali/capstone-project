"use client";

import { IconFolderOpen } from "@tabler/icons-react";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface PenilaianTableEmptyStateProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function PenilaianTableEmptyState<TData extends RowData>({ table }: PenilaianTableEmptyStateProps<TData>) {
  const searchQuery = (table.getColumn("search")?.getFilterValue() as string) ?? "";
  const hasColumnFilter = table.state.columnFilters.some((filter) => filter.id !== "search");
  const hasActiveFilter = searchQuery !== "" || hasColumnFilter;

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
          ) : hasActiveFilter ? (
            "Tidak ada mahasiswa yang cocok dengan filter yang dipilih"
          ) : (
            "Semua penilaian mahasiswa akan ditampilkan disini"
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
