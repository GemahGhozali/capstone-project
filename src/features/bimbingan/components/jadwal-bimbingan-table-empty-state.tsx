"use client";

import { IconBook } from "@tabler/icons-react";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface JadwalBimbinganTableEmptyStateProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function JadwalBimbinganTableEmptyState<TData extends RowData>({ table }: JadwalBimbinganTableEmptyStateProps<TData>) {
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? "";

  return (
    <Empty>
      <EmptyHeader className="max-w-none">
        <EmptyMedia variant="icon">
          <IconBook />
        </EmptyMedia>
        <EmptyTitle>{statusFilter ? "Jadwal Bimbingan Tidak Ditemukan" : "Belum Ada Jadwal Bimbingan"}</EmptyTitle>
        <EmptyDescription>
          {statusFilter ? (
            <>
              Tidak ada jadwal bimbingan berstatus <span className="font-medium">"{statusFilter}"</span>
            </>
          ) : (
            "Semua jadwal bimbingan yang pernah anda buat akan ditampilkan disini"
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
