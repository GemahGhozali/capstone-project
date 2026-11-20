"use client";

import { DataTable } from "@/components/data/data-table";
import { useMemo, useState } from "react";
import { BimbinganMahasiswa } from "../types";
import { BimbinganFormSheet } from "./bimbingan-form-sheet";
import { DeleteBimbinganAlertDialog } from "./delete-bimbingan-alert-dialog";
import { bimbinganMahasiswaTableColumns } from "./bimbingan-mahasiswa-table-columns";
import { BimbinganMahasiswaTableToolbar } from "./bimbingan-mahasiswa-table-toolbar";
import { BimbinganMahasiswaTableEmptyState } from "./bimbingan-mahasiswa-table-empty-state";

interface BimbinganMahasiswaTableProps {
  data: BimbinganMahasiswa[];
}

type BimbinganMahasiswaDialogActions =
  | { action: "create" }
  | { action: "edit"; bimbingan: BimbinganMahasiswa }
  | { action: "delete"; bimbingan: BimbinganMahasiswa };

export function BimbinganMahasiswaTable({ data }: BimbinganMahasiswaTableProps) {
  const [dialog, setDialog] = useState<BimbinganMahasiswaDialogActions | undefined>(undefined);

  const handleCreateKuesioner = () => setDialog({ action: "create" });

  const handleCloseDialog = () => setDialog(undefined);

  const bimbinganToEdit = dialog?.action === "edit" ? dialog.bimbingan : undefined;
  const bimbinganToDelete = dialog?.action === "delete" ? dialog.bimbingan : undefined;
  const openBimbinganForm = dialog?.action === "create" || dialog?.action === "edit";

  const columns = useMemo(
    () =>
      bimbinganMahasiswaTableColumns({
        onEdit: (bimbingan) => setDialog({ action: "edit", bimbingan }),
        onDelete: (bimbingan) => setDialog({ action: "delete", bimbingan }),
      }),
    [],
  );

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        getRowId={(bimbingan) => bimbingan.id}
        initialState={{ columnVisibility: { search: false } }}
        renderToolbar={(table) => <BimbinganMahasiswaTableToolbar table={table} onCreate={handleCreateKuesioner} />}
        renderEmptyState={(table) => <BimbinganMahasiswaTableEmptyState table={table} />}
      />

      <BimbinganFormSheet open={openBimbinganForm} bimbingan={bimbinganToEdit} closeDialog={handleCloseDialog} />
      <DeleteBimbinganAlertDialog bimbingan={bimbinganToDelete} closeDialog={handleCloseDialog} />
    </>
  );
}
