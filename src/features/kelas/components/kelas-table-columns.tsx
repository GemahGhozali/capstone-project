"use client";

import { Button } from "@/components/ui/button";
import { IconEdit } from "@tabler/icons-react";
import { KelasOverview } from "../types";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<DataTableFeatures, KelasOverview>();

export interface KelasTableActions {
  onEdit: (kelas: KelasOverview) => void;
}

export function kelasTableColumns({ onEdit }: KelasTableActions) {
  return columnHelper.columns([
    columnHelper.accessor("kode", {
      header: "Kode Kelas",
    }),

    columnHelper.accessor("nama", {
      header: "Nama Kelas",
    }),

    columnHelper.accessor("angkatan", {
      header: "Tahun Angkatan",
    }),

    columnHelper.accessor("totalMahasiswa", {
      header: "Total Mahasiswa",
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const kelas = row.original;

        return (
          <Button variant="outline" size="icon-sm" onClick={() => onEdit(kelas)}>
            <IconEdit stroke={1.75} />
          </Button>
        );
      },
    }),
  ]);
}
