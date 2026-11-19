"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data/data-table";
import { BimbinganMahasiswaMonitoring } from "../types";
import { bimbinganMonitoringTableColumns } from "./bimbingan-monitoring-table-columns";
import { BimbinganMonitoringTableToolbar } from "./bimbingan-monitoring-table-toolbar";
import { BimbinganMonitoringTableEmptyState } from "./bimbingan-monitoring-table-empty-state";

interface BimbinganMonitoringTableProps {
  data: BimbinganMahasiswaMonitoring[];
}

export function BimbinganMonitoringTable({ data }: BimbinganMonitoringTableProps) {
  const columns = useMemo(() => bimbinganMonitoringTableColumns(data), [data]);

  return (
    <DataTable
      data={data}
      columns={columns}
      getRowId={(mahasiswa) => mahasiswa.id}
      initialState={{ columnVisibility: { search: false } }}
      renderToolbar={(table) => <BimbinganMonitoringTableToolbar table={table} />}
      renderEmptyState={(table) => <BimbinganMonitoringTableEmptyState table={table} />}
    />
  );
}
