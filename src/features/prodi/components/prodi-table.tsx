"use client";

import { DataTable } from "@/components/data/data-table";
import { ProdiOverview } from "../types";
import { ProdiFormDialog } from "./prodi-form-dialog";
import { useMemo, useState } from "react";
import { prodiTableColumns } from "./prodi-table-columns";
import { ProdiTableToolbar } from "./prodi-table-toolbar";
import { ProdiTableEmptyState } from "./prodi-table-empty-state";

interface ProdiTableProps {
  data: ProdiOverview[];
}

export function ProdiTable({ data }: ProdiTableProps) {
  const [prodiToEdit, setProdiToEdit] = useState<ProdiOverview | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns = useMemo(
    () =>
      prodiTableColumns({
        onEdit: (prodi) => {
          setProdiToEdit(prodi);
          setIsDialogOpen(true);
        },
      }),
    [],
  );

  const handleTambah = () => {
    setProdiToEdit(undefined);
    setIsDialogOpen(true);
  };

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        renderToolbar={(table) => <ProdiTableToolbar table={table} onTambah={handleTambah} />}
        renderEmptyState={(table) => <ProdiTableEmptyState table={table} />}
      />
      <ProdiFormDialog prodi={prodiToEdit} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
