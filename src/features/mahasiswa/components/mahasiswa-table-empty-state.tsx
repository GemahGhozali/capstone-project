"use client";

import { IconFolderOpen } from "@tabler/icons-react";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface MahasiswaTableEmptyStateProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function MahasiswaTableEmptyState<TData extends RowData>({ table }: MahasiswaTableEmptyStateProps<TData>) {
  const searchQuery = (table.getColumn("search")?.getFilterValue() as string) ?? "";
  const selectedStatus = (table.getColumn("status")?.getFilterValue() as string) ?? "";

  const hasActiveFilter = searchQuery || selectedStatus;

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderOpen />
        </EmptyMedia>
        <EmptyTitle>{hasActiveFilter ? "Mahasiswa Tidak Ditemukan" : "Tidak Ada Data Mahasiswa"}</EmptyTitle>
        <EmptyDescription>
          {searchQuery ? (
            <>
              Tidak ada mahasiswa dengan nama atau NIM <span className="font-medium">"{searchQuery}"</span>
            </>
          ) : selectedStatus ? (
            <>
              Tidak ada mahasiswa dengan status <span className="font-medium">&ldquo;{selectedStatus}&rdquo;</span>
            </>
          ) : (
            "Semua data mahasiswa akan ditampilkan disini"
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
