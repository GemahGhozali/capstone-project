"use client";

import { IconBook } from "@tabler/icons-react";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface BimbinganDosenTableEmptyStateProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function BimbinganDosenTableEmptyState<TData extends RowData>({ table }: BimbinganDosenTableEmptyStateProps<TData>) {
  const searchQuery = (table.getColumn("search")?.getFilterValue() as string) ?? "";

  const totalRows = table.getPreFilteredRowModel().rows.length;
  const filteredRows = table.getFilteredRowModel().rows.length;
  const isFilterResultEmpty = totalRows > 0 && filteredRows === 0;

  return (
    <Empty>
      <EmptyHeader className="max-w-none!">
        <EmptyMedia variant="icon">
          <IconBook />
        </EmptyMedia>
        <EmptyTitle>{isFilterResultEmpty ? "Bimbingan Tidak Ditemukan" : "Tidak Ada Data Bimbingan"}</EmptyTitle>
        <EmptyDescription>
          {searchQuery ? (
            <>
              Tidak ada mahasiswa dengan NIM atau nama <span className="font-medium">&ldquo;{searchQuery}&rdquo;</span>
            </>
          ) : isFilterResultEmpty ? (
            <>Tidak ada bimbingan mahasiswa yang cocok dengan filter yang dipilih</>
          ) : (
            "Semua catatan bimbingan mahasiswa anda akan ditampilkan disini"
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
