"use client";

import { IconBook } from "@tabler/icons-react";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface BookingBimbinganDosenTableEmptyStateProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function BookingBimbinganDosenTableEmptyState<TData extends RowData>({ table }: BookingBimbinganDosenTableEmptyStateProps<TData>) {
  const searchQuery = (table.getColumn("mahasiswa")?.getFilterValue() as string) ?? "";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? "";

  const hasFilter = searchQuery || statusFilter;

  return (
    <Empty>
      <EmptyHeader className="max-w-none">
        <EmptyMedia variant="icon">
          <IconBook />
        </EmptyMedia>
        <EmptyTitle>{hasFilter ? "Booking Bimbingan Tidak Ditemukan" : "Belum Ada Yang Booking Bimbingan"}</EmptyTitle>
        <EmptyDescription>
          {searchQuery ? (
            <>
              Tidak ada mahasiswa dengan nama atau NIM <span className="font-medium">"{searchQuery}"</span>
            </>
          ) : statusFilter ? (
            <>
              Tidak ada booking bimbingan berstatus <span className="font-medium">"{statusFilter}"</span>
            </>
          ) : (
            "Mahasiswa yang booking jadwal bimbingan ini akan ditampilkan disini"
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
