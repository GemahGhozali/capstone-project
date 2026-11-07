"use client";

import { DataTable } from "@/components/data/data-table";
import { useMemo, useState } from "react";
import { KuesionerOverview } from "../types";
import { KuesionerFormDialog } from "./kuesioner-form-dialog";
import { kuesionerTableColumns } from "./kuesioner-table-columns";
import { KuesionerTableToolbar } from "./kuesioner-table-toolbar";
import { useDuplicateKuesioner } from "../hooks";
import { ChangeStatusAlertDialog } from "./change-status-alert-dialog";
import { KuesionerTableEmptyState } from "./kuesioner-table-empty-state";
import { DeleteKuesionerAlertDialog } from "./delete-kuesioner-alert-dialog";

export type KuesionerDialogAction =
  | { action: "create" }
  | { action: "edit"; kuesioner: KuesionerOverview }
  | { action: "delete"; kuesioner: KuesionerOverview }
  | { action: "changeStatus"; kuesioner: KuesionerOverview; mode: "publish" | "close" };

interface KuesionerTableProps {
  data: KuesionerOverview[];
}

export function KuesionerTable({ data }: KuesionerTableProps) {
  const [dialog, setDialog] = useState<KuesionerDialogAction | undefined>(undefined);

  const { mutate: duplicateKuesioner } = useDuplicateKuesioner();

  const handleCreateKuesioner = () => setDialog({ action: "create" });

  const handleCloseDialog = () => setDialog(undefined);

  const statusChange = dialog?.action === "changeStatus" ? { kuesioner: dialog.kuesioner, mode: dialog.mode } : undefined;
  const kuesionerToEdit = dialog?.action === "edit" ? dialog.kuesioner : undefined;
  const kuesionerToDelete = dialog?.action === "delete" ? dialog.kuesioner : undefined;
  const openKuesionerForm = dialog?.action === "create" || dialog?.action === "edit";

  const columns = useMemo(
    () =>
      kuesionerTableColumns({
        onDuplicate: (kuesioner) => duplicateKuesioner(kuesioner.id),
        onEdit: (kuesioner) => setDialog({ action: "edit", kuesioner }),
        onDelete: (kuesioner) => setDialog({ action: "delete", kuesioner }),
        onChangeStatus: (kuesioner, mode) => setDialog({ action: "changeStatus", kuesioner, mode }),
      }),
    [],
  );

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        initialState={{ columnVisibility: { search: false } }}
        renderToolbar={(table) => <KuesionerTableToolbar table={table} onCreate={handleCreateKuesioner} />}
        renderEmptyState={(table) => <KuesionerTableEmptyState table={table} />}
      />
      <KuesionerFormDialog kuesioner={kuesionerToEdit} open={openKuesionerForm} closeDialog={handleCloseDialog} />
      <DeleteKuesionerAlertDialog kuesionerToDelete={kuesionerToDelete} closeDialog={handleCloseDialog} />
      <ChangeStatusAlertDialog statusChange={statusChange} closeDialog={handleCloseDialog} />
    </>
  );
}
