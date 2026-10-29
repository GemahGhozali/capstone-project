"use client";

import { DataTable } from "@/components/data/data-table";
import { KelasOverview } from "../types";
import { KelasFormDialog } from "./kelas-form-dialog";
import { useMemo, useState } from "react";
import { kelasTableColumns } from "./kelas-table-columns";
import { KelasTableToolbar } from "./kelas-table-toolbar";
import { KelasTableEmptyState } from "./kelas-table-empty-state";

interface KelasTableProps {
  data: KelasOverview[];
}

export function KelasTable({ data }: KelasTableProps) {
  const [kelasToEdit, setKelasToEdit] = useState<KelasOverview | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns = useMemo(
    () =>
      kelasTableColumns({
        onEdit: (kelas) => {
          setKelasToEdit(kelas);
          setIsDialogOpen(true);
        },
      }),
    [],
  );

  const handleTambah = () => {
    setKelasToEdit(undefined);
    setIsDialogOpen(true);
  };

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        renderToolbar={(table) => <KelasTableToolbar table={table} onTambah={handleTambah} />}
        renderEmptyState={(table) => <KelasTableEmptyState table={table} />}
      />
      <KelasFormDialog kelas={kelasToEdit} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
