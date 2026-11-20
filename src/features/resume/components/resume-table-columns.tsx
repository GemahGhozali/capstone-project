"use client";

import Link from "next/link";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { IconEye } from "@tabler/icons-react";
import { id as localeId } from "date-fns/locale";
import { DataTableFeatures } from "@/components/data/features";
import { DataColumnFilter } from "@/components/data/data-column-filter";
import { resumeStatusStyles } from "../utils";
import { createColumnHelper } from "@tanstack/react-table";
import { ArchiveResumeButton } from "./archive-resume-button";
import { generateNameInitials } from "@/utils/generate-name-initials";
import { ResumeListItem, ResumeViewer } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const columnHelper = createColumnHelper<DataTableFeatures, ResumeListItem>();

function dosenPembimbingColumn(options: string[]) {
  return columnHelper.accessor("dosenPembimbing", {
    filterFn: "arrHas",
    header: ({ column }) => <DataColumnFilter column={column} title="Dosen Pembimbing" options={options} />,
    cell: ({ getValue }) => (getValue() ? <span>{getValue()}</span> : <Badge className="bg-neutral-500/15 text-neutral-500">Tidak Ditemukan</Badge>),
  });
}

interface ResumeTableColumnsProps {
  data: ResumeListItem[];
  basePath: string;
  viewer: ResumeViewer;
}

export function resumeTableColumns({ data, basePath, viewer }: ResumeTableColumnsProps) {
  const dosenPembimbingOptions = [...new Set(data.map((row) => row.dosenPembimbing).filter((nama): nama is string => !!nama))].sort();

  return columnHelper.columns([
    columnHelper.accessor((row) => `${row.namaMahasiswa} ${row.nim} ${row.subjudul} ${row.mitra}`, {
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

    columnHelper.accessor("mitra", {
      header: "Mitra",
      cell: ({ getValue }) => <span className="block min-w-48 whitespace-normal">{getValue()}</span>,
    }),

    columnHelper.accessor("subjudul", {
      header: "Subjudul",
      cell: ({ getValue }) => <span className="block min-w-48 whitespace-normal">{getValue()}</span>,
    }),

    columnHelper.accessor("tanggalPengajuan", {
      header: "Tanggal Pengajuan",
      cell: ({ getValue }) => format(getValue(), "eeee, d MMMM yyyy", { locale: localeId }),
    }),

    ...(viewer === "Kaprodi" ? [dosenPembimbingColumn(dosenPembimbingOptions)] : []),

    columnHelper.accessor("status", {
      id: "status",
      header: "Status",
      filterFn: "equalsString",
      cell: ({ getValue }) => {
        const status = getValue();

        return <Badge className={cn(resumeStatusStyles[status])}>{status}</Badge>;
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link href={`${basePath}/${row.original.id}/detail`}>
            <Button variant="outline" size="icon-sm">
              <IconEye />
            </Button>
          </Link>
          {viewer === "Kaprodi" && <ArchiveResumeButton id={row.original.id} status={row.original.status} />}
        </div>
      ),
    }),
  ]);
}
