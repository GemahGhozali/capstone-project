"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data/data-table";
import { usePathname } from "next/navigation";
import { ProposalTableToolbar } from "./proposal-table-toolbar";
import { proposalTableColumns } from "./proposal-table-columns";
import { ProposalTableEmptyState } from "./proposal-table-empty-state";
import { ProposalListItem, ProposalViewer } from "../types";

interface ProposalTableProps {
  data: ProposalListItem[];
  viewer: ProposalViewer;
}

export function ProposalTable({ data, viewer }: ProposalTableProps) {
  const pathname = usePathname();
  const columns = useMemo(() => proposalTableColumns({ basePath: pathname, viewer }), [pathname, viewer]);

  return (
    <DataTable
      data={data}
      columns={columns}
      enableRowSelection={viewer === "Kaprodi"}
      getRowId={(proposal) => proposal.id}
      initialState={{ columnVisibility: { search: false } }}
      renderToolbar={(table) => <ProposalTableToolbar table={table} showExport={viewer === "Kaprodi"} />}
      renderEmptyState={(table) => <ProposalTableEmptyState table={table} />}
    />
  );
}
