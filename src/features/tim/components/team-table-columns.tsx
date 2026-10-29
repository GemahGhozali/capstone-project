"use client";

import Link from "next/link";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { IconEye } from "@tabler/icons-react";
import { TeamListItem } from "../types";
import { id as localeId } from "date-fns/locale";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<DataTableFeatures, TeamListItem>();

export function teamTableColumns() {
  return columnHelper.columns([
    columnHelper.accessor("nama", {
      header: "Nama Tim",
    }),

    columnHelper.accessor("jumlahAnggota", {
      header: "Jumlah Anggota",
    }),

    columnHelper.accessor("tanggalPembuatan", {
      header: "Tanggal Pembuatan",
      cell: ({ getValue }) => format(getValue(), "eeee, dd MMMM yyyy", { locale: localeId }),
    }),

    columnHelper.accessor("status", {
      header: "Status",
      filterFn: "equalsString",
      cell: ({ getValue }) => {
        const status = getValue();

        return (
          <Badge
            className={cn(status === "Lengkap" && "bg-green-500/15 text-green-500", status === "Belum Lengkap" && "bg-blue-500/15 text-blue-500")}
          >
            {status}
          </Badge>
        );
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <Link href={`/kaprodi/daftar-tim/${row.original.id}/detail`}>
          <Button variant="outline" size="icon-sm" aria-label="Lihat detail tim">
            <IconEye stroke={1.75} />
          </Button>
        </Link>
      ),
    }),
  ]);
}
