"use client";

import { IconFolderOpen } from "@tabler/icons-react";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface ResumeTableEmptyStateProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function ResumeTableEmptyState<TData extends RowData>({ table }: ResumeTableEmptyStateProps<TData>) {
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
        <EmptyTitle>{isFilterResultEmpty ? "Resume Tidak Ditemukan" : "Tidak Ada Data Resume"}</EmptyTitle>
        <EmptyDescription>
          {searchQuery ? (
            <>
              Tidak ada resume dengan kata kunci <span className="font-medium">&ldquo;{searchQuery}&rdquo;</span>
            </>
          ) : isFilterResultEmpty ? (
            <>Tidak ada resume yang cocok dengan filter yang dipilih</>
          ) : (
            "Semua resume yang masuk akan ditampilkan disini"
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
