"use client";

import { IconFolderOpen } from "@tabler/icons-react";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface MahasiswaTableEmptyStateProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function MahasiswaTableEmptyState<TData extends RowData>({ table }: MahasiswaTableEmptyStateProps<TData>) {
  const searchQuery = (table.getColumn("namaLengkap")?.getFilterValue() as string) ?? "";

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderOpen />
        </EmptyMedia>
        <EmptyTitle>{searchQuery ? "Mahasiswa Tidak Ditemukan" : "Tidak Ada Data Mahasiswa"}</EmptyTitle>
        <EmptyDescription>
          {searchQuery ? (
            <>
              Tidak ada mahasiswa dengan nama <span className="font-medium">"{searchQuery}"</span>
            </>
          ) : (
            "Data mahasiswa akan ditampilkan disini"
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
