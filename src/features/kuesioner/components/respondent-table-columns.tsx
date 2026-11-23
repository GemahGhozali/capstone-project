"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { IconEye } from "@tabler/icons-react";
import { DataColumnSort } from "@/components/data/data-column-sort";
import { id as localeId } from "date-fns/locale";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";
import { KuesionerRespondent } from "../types";

const columnHelper = createColumnHelper<DataTableFeatures, KuesionerRespondent>();

export function respondentTableColumns({ kuesionerId }: { kuesionerId: string }) {
  return columnHelper.columns([
    columnHelper.accessor("nama", {
      header: "Daftar Responden",
    }),

    columnHelper.accessor("tanggalSubmit", {
      header: ({ column }) => <DataColumnSort column={column} title="Tanggal Submit" />,
      cell: ({ getValue }) => format(getValue(), "eeee, dd MMMM yyyy", { locale: localeId }),
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`/kaprodi/daftar-kuesioner/${kuesionerId}/responden/${row.original.id}/detail`}>
          <Button variant="outline" size="sm">
            <IconEye data-icon="inline-start" />
            Lihat Detail
          </Button>
        </Link>
      ),
    }),
  ]);
}
