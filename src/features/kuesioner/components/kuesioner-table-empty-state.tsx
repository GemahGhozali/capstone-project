"use client";

import { IconFolderOpen } from "@tabler/icons-react";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface KuesionerTableEmptyStateProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function KuesionerTableEmptyState<TData extends RowData>({ table }: KuesionerTableEmptyStateProps<TData>) {
  const searchQuery = (table.getColumn("search")?.getFilterValue() as string) ?? "";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? "";

  const hasFilter = searchQuery || statusFilter;

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderOpen />
        </EmptyMedia>
        <EmptyTitle>{hasFilter ? "Kuesioner Tidak Ditemukan" : "Belum Ada Data Kuesioner"}</EmptyTitle>
        <EmptyDescription>
          {searchQuery ? (
            <>
              Tidak ada kuesioner dengan kata kunci <span className="font-medium">"{searchQuery}"</span>
            </>
          ) : statusFilter ? (
            <>
              Tidak ada kuesioner berstatus <span className="font-medium">"{statusFilter}"</span>
            </>
          ) : (
            "Semua data kuesioner akan ditampilkan disini"
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
