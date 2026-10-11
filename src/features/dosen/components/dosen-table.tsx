"use client";

import { DataTable } from "@/components/data/data-table";
import { DosenOverview } from "../types";
import { useMemo, useState } from "react";
import { dosenTableColumns } from "@/features/dosen/components/dosen-table-columns";
import { DosenTableToolbar } from "./dosen-table-toolbar";
import { DosenTableEmptyState } from "./dosen-table-empty-state";
import { DeleteDosenAlertDialog } from "./delete-dosen-alert-dialog";

interface DosenTableProps {
  data: DosenOverview[];
}

export function DosenTable({ data }: DosenTableProps) {
  const [dosenToDelete, setDosenToDelete] = useState<DosenOverview | undefined>(undefined);

  const columns = useMemo(() => dosenTableColumns({ onDelete: setDosenToDelete }), [setDosenToDelete]);

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        initialState={{ columnVisibility: { role: false } }}
        renderToolbar={(table) => <DosenTableToolbar table={table} />}
        renderEmptyState={(table) => <DosenTableEmptyState table={table} />}
      />
      <DeleteDosenAlertDialog dosenToDelete={dosenToDelete} setDosenToDelete={setDosenToDelete} />
    </>
  );
}
