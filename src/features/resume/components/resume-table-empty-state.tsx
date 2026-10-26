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
  const selectedStatus = (table.getColumn("status")?.getFilterValue() as string) ?? "";

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderOpen />
        </EmptyMedia>
        <EmptyTitle>{searchQuery || selectedStatus ? "Resume Tidak Ditemukan" : "Tidak Ada Resume"}</EmptyTitle>
        <EmptyDescription>
          {searchQuery ? (
            <>
              Tidak ada mahasiswa dengan nama atau NIM <span className="font-medium">&ldquo;{searchQuery}&rdquo;</span>
            </>
          ) : selectedStatus ? (
            <>
              Tidak ada resume dengan status <span className="font-medium">&ldquo;{selectedStatus}&rdquo;</span>
            </>
          ) : (
            "Semua resume yang masuk akan ditampilkan disini"
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
