"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data/data-table";
import { CapstoneProjectMonitoring } from "../types";
import { CapstoneProjectMonitoringTableToolbar } from "./capstone-project-monitoring-table-toolbar";
import { capstoneProjectMonitoringTableColumns } from "./capstone-project-monitoring-table-columns";
import { CapstoneProjectMonitoringTableEmptyState } from "./capstone-project-monitoring-table-empty-state";

interface CapstoneProjectMonitoringTableProps {
  data: CapstoneProjectMonitoring[];
}

export function CapstoneProjectMonitoringTable({ data }: CapstoneProjectMonitoringTableProps) {
  const columns = useMemo(() => capstoneProjectMonitoringTableColumns(), []);

  return (
    <DataTable
      data={data}
      columns={columns}
      initialState={{ columnVisibility: { search: false } }}
      renderToolbar={(table) => <CapstoneProjectMonitoringTableToolbar table={table} />}
      renderEmptyState={(table) => <CapstoneProjectMonitoringTableEmptyState table={table} />}
    />
  );
}
