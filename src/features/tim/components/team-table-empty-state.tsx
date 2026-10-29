"use client";

import { IconFolderOpen } from "@tabler/icons-react";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface TeamTableEmptyStateProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function TeamTableEmptyState<TData extends RowData>({ table }: TeamTableEmptyStateProps<TData>) {
  const searchQuery = (table.getColumn("nama")?.getFilterValue() as string) ?? "";
  const selectedStatus = (table.getColumn("status")?.getFilterValue() as string) ?? "";

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderOpen />
        </EmptyMedia>
        <EmptyTitle>{searchQuery || selectedStatus ? "Tim Tidak Ditemukan" : "Tidak Ada Data Tim"}</EmptyTitle>
        <EmptyDescription>
          {searchQuery ? (
            <>
              Tidak ada tim dengan nama <span className="font-medium">&ldquo;{searchQuery}&rdquo;</span>
            </>
          ) : selectedStatus ? (
            <>
              Tidak ada tim dengan status <span className="font-medium">&ldquo;{selectedStatus}&rdquo;</span>
            </>
          ) : (
            "Semua tim yang terdaftar akan ditampilkan disini"
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
