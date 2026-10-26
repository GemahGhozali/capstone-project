"use client";

import { IconFolderOpen } from "@tabler/icons-react";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface ProposalTableEmptyStateProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function ProposalTableEmptyState<TData extends RowData>({ table }: ProposalTableEmptyStateProps<TData>) {
  const searchQuery = (table.getColumn("namaTim")?.getFilterValue() as string) ?? "";

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderOpen />
        </EmptyMedia>
        <EmptyTitle>{searchQuery ? "Proposal Tidak Ditemukan" : "Tidak Ada Proposal Masuk"}</EmptyTitle>
        <EmptyDescription>
          {searchQuery ? (
            <>
              Tidak ada proposal dengan nama tim <span className="font-medium">&ldquo;{searchQuery}&rdquo;</span>
            </>
          ) : (
            "Proposal yang masuk akan ditampilkan disini"
          )}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
