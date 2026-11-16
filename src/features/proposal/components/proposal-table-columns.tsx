"use client";

import Link from "next/link";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { IconEye } from "@tabler/icons-react";
import { id as localeId } from "date-fns/locale";
import { ProposalListItem } from "../types";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";
import { proposalStatusStyles } from "../utils";

const columnHelper = createColumnHelper<DataTableFeatures, ProposalListItem>();

export function proposalTableColumns({ basePath }: { basePath: string }) {
  return columnHelper.columns([
    columnHelper.accessor((row) => `${row.namaTim} ${row.judul} ${row.mitra}`, {
      id: "search",
      filterFn: "includesString",
    }),

    columnHelper.accessor("namaTim", {
      header: "Nama Tim",
    }),

    columnHelper.accessor("mitra", {
      header: "Mitra",
      cell: ({ getValue }) => <span className="block min-w-48 whitespace-normal">{getValue()}</span>,
    }),

    columnHelper.accessor("judul", {
      header: "Judul",
      cell: ({ getValue }) => <span className="block min-w-48 whitespace-normal">{getValue()}</span>,
    }),

    columnHelper.accessor("tanggalPengajuan", {
      header: "Tanggal Pengajuan",
      cell: ({ getValue }) => format(getValue(), "eeee, dd MMMM yyyy", { locale: localeId }),
    }),

    columnHelper.accessor("status", {
      header: "Status",
      filterFn: "equalsString",
      cell: ({ getValue }) => {
        const status = getValue();
        return <Badge className={cn(proposalStatusStyles[status])}>{status}</Badge>;
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`${basePath}/${row.original.id}/detail`}>
          <Button variant="outline" size="sm" aria-label="Lihat detail proposal">
            <IconEye stroke={1.75} data-icon="inline-start" />
            Lihat Detail
          </Button>
        </Link>
      ),
    }),
  ]);
}
