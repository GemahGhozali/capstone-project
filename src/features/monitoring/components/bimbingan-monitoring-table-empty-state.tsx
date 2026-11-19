"use client";

import { IconFolderOpen } from "@tabler/icons-react";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface BimbinganMonitoringTableEmptyStateProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function BimbinganMonitoringTableEmptyState<TData extends RowData>({ table }: BimbinganMonitoringTableEmptyStateProps<TData>) {
  const searchQuery = (table.getColumn("search")?.getFilterValue() as string) ?? "";

  const totalRows = table.getPreFilteredRowModel().rows.length;
  const filteredRows = table.getFilteredRowModel().rows.length;
  const isFilterResultEmpty = totalRows > 0 && filteredRows === 0;

  return (
    <Empty>
      <EmptyHeader className="max-w-none!">
        <EmptyMedia variant="icon">
          <IconFolderOpen />
        </EmptyMedia>
        <EmptyTitle>{isFilterResultEmpty ? "Mahasiswa Tidak Ditemukan" : "Tidak Ada Data Bimbingan"}</EmptyTitle>
        <EmptyDescription>
          {searchQuery ? (
            <>
              Tidak ada mahasiswa dengan kata kunci <span className="font-medium">&ldquo;{searchQuery}&rdquo;</span>
            </>
          ) : isFilterResultEmpty ? (
            <>Tidak ada mahasiswa yang cocok dengan filter yang dipilih</>
          ) : (
            "Mahasiswa aktif dengan resume disetujui akan ditampilkan disini"
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
