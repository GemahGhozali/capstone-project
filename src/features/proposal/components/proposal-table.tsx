"use client";

import { DataTable } from "@/components/data/data-table";
import { ProposalListItem } from "../types";
import { proposalTableColumns } from "./proposal-table-columns";
import { ProposalTableToolbar } from "./proposal-table-toolbar";
import { ProposalTableEmptyState } from "./proposal-table-empty-state";

interface ProposalTableProps {
  data: ProposalListItem[];
}

export function ProposalTable({ data }: ProposalTableProps) {
  return (
    <DataTable
      data={data}
      columns={proposalTableColumns}
      initialState={{ columnVisibility: { search: false } }}
      renderToolbar={(table) => <ProposalTableToolbar table={table} />}
      renderEmptyState={(table) => <ProposalTableEmptyState table={table} />}
    />
  );
}
