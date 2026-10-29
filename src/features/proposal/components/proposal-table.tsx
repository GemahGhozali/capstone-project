"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { DataTable } from "@/components/data/data-table";
import { ProposalListItem } from "../types";
import { ProposalTableToolbar } from "./proposal-table-toolbar";
import { proposalTableColumns } from "./proposal-table-columns";
import { ProposalTableEmptyState } from "./proposal-table-empty-state";

interface ProposalTableProps {
  data: ProposalListItem[];
}

export function ProposalTable({ data }: ProposalTableProps) {
  const pathname = usePathname();
  const columns = useMemo(() => proposalTableColumns({ basePath: pathname }), [pathname]);

  return (
    <DataTable
      data={data}
      columns={columns}
      initialState={{ columnVisibility: { search: false } }}
      renderToolbar={(table) => <ProposalTableToolbar table={table} />}
      renderEmptyState={(table) => <ProposalTableEmptyState table={table} />}
    />
  );
}
