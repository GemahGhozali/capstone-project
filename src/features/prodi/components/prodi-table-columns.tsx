"use client";

import { Button } from "@/components/ui/button";
import { IconEdit } from "@tabler/icons-react";
import { ProdiOverview } from "../types";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<DataTableFeatures, ProdiOverview>();

export interface ProdiTableActions {
  onEdit: (prodi: ProdiOverview) => void;
}

export function prodiTableColumns({ onEdit }: ProdiTableActions) {
  return columnHelper.columns([
    columnHelper.accessor("nama", {
      header: "Nama Prodi",
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const prodi = row.original;

        return (
          <Button variant="outline" size="icon-sm" onClick={() => onEdit(prodi)}>
            <IconEdit stroke={1.75} />
          </Button>
        );
      },
    }),
  ]);
}
