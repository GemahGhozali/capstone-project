"use client";

import { DataTable } from "@/components/data/data-table";
import { MahasiswaOverview } from "../types";
import { useMemo, useState } from "react";
import { mahasiswaTableColumns } from "./mahasiswa-table-columns";
import { MahasiswaTableToolbar } from "./mahasiswa-table-toolbar";
import { MahasiswaTableEmptyState } from "./mahasiswa-table-empty-state";
import { DeleteMahasiswaAlertDialog } from "./delete-mahasiswa-alert-dialog";

interface MahasiswaTableProps {
  data: MahasiswaOverview[];
}

export function MahasiswaTable({ data }: MahasiswaTableProps) {
  const [mahasiswaToDelete, setMahasiswaToDelete] = useState<MahasiswaOverview | undefined>(undefined);

  const columns = useMemo(() => mahasiswaTableColumns({ onDelete: setMahasiswaToDelete }), [setMahasiswaToDelete]);

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        renderToolbar={(table) => <MahasiswaTableToolbar table={table} />}
        renderEmptyState={(table) => <MahasiswaTableEmptyState table={table} />}
      />
      <DeleteMahasiswaAlertDialog mahasiswaToDelete={mahasiswaToDelete} setMahasiswaToDelete={setMahasiswaToDelete} />
    </>
  );
}
