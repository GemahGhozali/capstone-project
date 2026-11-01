"use client";

import Link from "next/link";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { IconEye } from "@tabler/icons-react";
import { id as localeId } from "date-fns/locale";
import { DataTableFeatures } from "@/components/data/features";
import { resumeStatusStyles } from "../utils";
import { createColumnHelper } from "@tanstack/react-table";
import { generateNameInitials } from "@/utils/generate-name-initials";
import { ResumeListItem, ResumeViewer } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const columnHelper = createColumnHelper<DataTableFeatures, ResumeListItem>();

const dosenPembimbingColumn = columnHelper.accessor("dosenPembimbing", {
  header: "Dosen Pembimbing",
  cell: ({ getValue }) => (getValue() ? <span>{getValue()}</span> : <Badge className="bg-neutral-500/15 text-neutral-500">Tidak Ditemukan</Badge>),
});

export function resumeTableColumns({ basePath, viewer }: { basePath: string; viewer: ResumeViewer }) {
  return columnHelper.columns([
    columnHelper.accessor((row) => `${row.namaMahasiswa} ${row.nim}`, {
      id: "search",
      filterFn: "includesString",
    }),

    columnHelper.accessor("namaMahasiswa", {
      header: "Mahasiswa",
      cell: ({ row, getValue }) => {
        const nama = getValue();
        const nim = row.original.nim;
        const fotoProfil = row.original.fotoProfil;

        return (
          <div className="flex gap-4 items-center">
            <Avatar size="lg">
              <AvatarImage src={fotoProfil || ""} />
              <AvatarFallback>{generateNameInitials(nama)}</AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="font-medium">{nama}</p>
              <p className="text-muted-foreground">{nim}</p>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("tanggalPengajuan", {
      header: "Tanggal Pengajuan",
      cell: ({ getValue }) => format(getValue(), "eeee, d MMMM yyyy", { locale: localeId }),
    }),

    columnHelper.accessor("status", {
      header: "Status",
      filterFn: "equalsString",
      cell: ({ getValue }) => {
        const status = getValue();

        return <Badge className={cn(resumeStatusStyles[status])}>{status}</Badge>;
      },
    }),

    ...(viewer === "Kaprodi" ? [dosenPembimbingColumn] : []),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`${basePath}/${row.original.id}/detail`}>
          <Button variant="outline" size="sm" aria-label="Lihat detail resume">
            <IconEye stroke={1.75} data-icon="inline-start" />
            Lihat Detail
          </Button>
        </Link>
      ),
    }),
  ]);
}
