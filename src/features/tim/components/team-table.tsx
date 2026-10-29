"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data/data-table";
import { TeamListItem } from "../types";
import { TeamTableToolbar } from "./team-table-toolbar";
import { teamTableColumns } from "./team-table-columns";
import { TeamTableEmptyState } from "./team-table-empty-state";

interface TeamTableProps {
  data: TeamListItem[];
}

export function TeamTable({ data }: TeamTableProps) {
  const columns = useMemo(() => teamTableColumns(), []);

  return (
    <DataTable
      data={data}
      columns={columns}
      renderToolbar={(table) => <TeamTableToolbar table={table} />}
      renderEmptyState={(table) => <TeamTableEmptyState table={table} />}
    />
  );
}
