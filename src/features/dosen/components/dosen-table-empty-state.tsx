"use client";

import { IconFolderOpen } from "@tabler/icons-react";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface DosenTableEmptyStateProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function DosenTableEmptyState<TData extends RowData>({ table }: DosenTableEmptyStateProps<TData>) {
  const searchQuery = (table.getColumn("search")?.getFilterValue() as string) ?? "";
  const selectedStatus = (table.getColumn("status")?.getFilterValue() as string) ?? "";
  const selectedRole = (table.getColumn("role")?.getFilterValue() as string) ?? "";

  const hasActiveFilter = searchQuery || selectedStatus || selectedRole;

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderOpen />
        </EmptyMedia>
        <EmptyTitle>{hasActiveFilter ? "Dosen Tidak Ditemukan" : "Tidak Ada Data Dosen"}</EmptyTitle>
        <EmptyDescription>
          {searchQuery ? (
            <>
              Tidak ada dosen dengan nama atau NIP <span className="font-medium">"{searchQuery}"</span>
            </>
          ) : selectedStatus ? (
            <>
              Tidak ada dosen dengan status <span className="font-medium">&ldquo;{selectedStatus}&rdquo;</span>
            </>
          ) : selectedRole ? (
            <>
              Tidak ada dosen dengan role <span className="font-medium">&ldquo;{selectedRole}&rdquo;</span>
            </>
          ) : (
            "Semua data dosen akan ditampilkan disini"
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
