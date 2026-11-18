"use client";

import { IconFolderOpen } from "@tabler/icons-react";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface ProposalTableEmptyStateProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function ProposalTableEmptyState<TData extends RowData>({ table }: ProposalTableEmptyStateProps<TData>) {
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
        <EmptyTitle>{isFilterResultEmpty ? "Tidak Ada Data Proposal" : "Proposal Tidak Ditemukan"}</EmptyTitle>
        <EmptyDescription>
          {searchQuery ? (
            <>
              Tidak ada proposal dengan kata kunci <span className="font-medium">&ldquo;{searchQuery}&rdquo;</span>
            </>
          ) : isFilterResultEmpty ? (
            <>Tidak ada proposal yang cocok dengan filter yang dipilih</>
          ) : (
            "Semua proposal yang masuk akan ditampilkan disini"
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
