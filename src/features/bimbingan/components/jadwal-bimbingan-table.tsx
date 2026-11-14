"use client";

import { DataTable } from "@/components/data/data-table";
import { useMemo, useState } from "react";
import { JadwalBimbinganDosen } from "../types";
import { useOpenJadwalBimbingan } from "../hooks";
import { jadwalBimbinganTableColumns } from "./jadwal-bimbingan-table-columns";
import { JadwalBimbinganTableEmptyState } from "./jadwal-bimbingan-table-empty-state";
import { DeleteJadwalBimbinganAlertDialog } from "./delete-jadwal-bimbingan-alert-dialog";
import { CloseJadwalBimbinganAlertDialog } from "./close-jadwal-bimbingan-alert-dialog";

interface JadwalBimbinganTableProps {
  jadwalList: JadwalBimbinganDosen[];
}

type TableAction = { type: "delete"; jadwal: JadwalBimbinganDosen } | { type: "close"; jadwal: JadwalBimbinganDosen };

export function JadwalBimbinganTable({ jadwalList }: JadwalBimbinganTableProps) {
  const { mutate: openJadwalBimbingan } = useOpenJadwalBimbingan();

  const [action, setAction] = useState<TableAction | undefined>(undefined);

  const columns = useMemo(
    () =>
      jadwalBimbinganTableColumns({
        onOpenAgain: (jadwal) => openJadwalBimbingan(jadwal.id),
        onCloseJadwal: (jadwal) => setAction({ type: "close", jadwal }),
        onDelete: (jadwal) => setAction({ type: "delete", jadwal }),
      }),
    [openJadwalBimbingan],
  );

  const resetAction = () => setAction(undefined);

  const jadwalToDelete = action?.type === "delete" ? action.jadwal : undefined;
  const jadwalToClose = action?.type === "close" ? action.jadwal : undefined;

  return (
    <>
      <DataTable data={jadwalList} columns={columns} renderEmptyState={(table) => <JadwalBimbinganTableEmptyState table={table} />} />
      <DeleteJadwalBimbinganAlertDialog jadwalToDelete={jadwalToDelete} closeDialog={resetAction} />
      <CloseJadwalBimbinganAlertDialog jadwalToClose={jadwalToClose} closeDialog={resetAction} />
    </>
  );
}
