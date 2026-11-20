"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data/data-table";
import { BimbinganDosenPembimbing } from "../types";
import { bimbinganDosenTableColumns } from "./bimbingan-dosen-table-columns";
import { BimbinganDosenTableToolbar } from "./bimbingan-dosen-table-toolbar";
import { BimbinganDosenTableEmptyState } from "./bimbingan-dosen-table-empty-state";

interface BimbinganDosenTableProps {
  data: BimbinganDosenPembimbing[];
}

export function BimbinganDosenTable({ data }: BimbinganDosenTableProps) {
  const columns = useMemo(() => bimbinganDosenTableColumns({ data }), [data]);

  return (
    <DataTable
      data={data}
      columns={columns}
      getRowId={(bimbingan) => bimbingan.id}
      initialState={{ columnVisibility: { search: false } }}
      renderToolbar={(table) => <BimbinganDosenTableToolbar table={table} />}
      renderEmptyState={(table) => <BimbinganDosenTableEmptyState table={table} />}
    />
  );
}
