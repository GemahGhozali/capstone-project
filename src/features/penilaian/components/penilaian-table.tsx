"use client";

import { DataTable } from "@/components/data/data-table";
import { NilaiMahasiswa } from "../types";
import { useMemo, useState } from "react";
import { PenilaianFormDialog } from "./penilaian-form-dialog";
import { penilaianTableColumns } from "./penilaian-table-columns";
import { PenilaianTableToolbar } from "./penilaian-table-toolbar";
import { PenilaianTableEmptyState } from "./penilaian-table-empty-state";
import { DeletePenilaianAlertDialog } from "./delete-penilaian-alert-dialog";

interface PenilaianTableProps {
  data: NilaiMahasiswa[];
}

type PenilaianDialogActions = { action: "edit"; mahasiswa: NilaiMahasiswa } | { action: "delete"; mahasiswa: NilaiMahasiswa };

export function PenilaianTable({ data }: PenilaianTableProps) {
  const [dialog, setDialog] = useState<PenilaianDialogActions | undefined>(undefined);

  const handleCloseDialog = () => setDialog(undefined);

  const mahasiswaToEdit = dialog?.action === "edit" ? dialog.mahasiswa : undefined;
  const mahasiswaToDelete = dialog?.action === "delete" ? dialog.mahasiswa : undefined;

  const columns = useMemo(
    () =>
      penilaianTableColumns({
        data,
        onEdit: (mahasiswa) => setDialog({ action: "edit", mahasiswa }),
        onDelete: (mahasiswa) => setDialog({ action: "delete", mahasiswa }),
      }),
    [data],
  );

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        initialState={{ columnVisibility: { search: false } }}
        renderToolbar={(table) => <PenilaianTableToolbar table={table} />}
        renderEmptyState={(table) => <PenilaianTableEmptyState table={table} />}
      />
      <PenilaianFormDialog mahasiswa={mahasiswaToEdit} open={mahasiswaToEdit !== undefined} closeDialog={handleCloseDialog} />
      <DeletePenilaianAlertDialog mahasiswa={mahasiswaToDelete} closeDialog={handleCloseDialog} />
    </>
  );
}
