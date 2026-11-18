"use client";

import { IconFolderOpen } from "@tabler/icons-react";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface TeamTableEmptyStateProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function TeamTableEmptyState<TData extends RowData>({ table }: TeamTableEmptyStateProps<TData>) {
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
        <EmptyTitle>{isFilterResultEmpty ? "Tim Tidak Ditemukan" : "Tidak Ada Data Tim"}</EmptyTitle>
        <EmptyDescription>
          {searchQuery ? (
            <>
              Tidak ada tim dengan kata kunci <span className="font-medium">&ldquo;{searchQuery}&rdquo;</span>
            </>
          ) : isFilterResultEmpty ? (
            <>Tidak ada tim yang cocok dengan filter yang dipilih</>
          ) : (
            "Semua tim yang terdaftar akan ditampilkan disini"
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
