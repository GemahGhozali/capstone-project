"use client";

import Link from "next/link";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DosenOverview } from "../types";
import { DataColumnSort } from "@/components/data/data-column-sort";
import { DataColumnFilter } from "@/components/data/data-column-filter";
import { dosenStatusStyles } from "../utils";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";
import { generateNameInitials } from "@/utils/generate-name-initials";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const columnHelper = createColumnHelper<DataTableFeatures, DosenOverview>();

export interface DosenTableActions {
  data: DosenOverview[];
  onDelete: (dosen: DosenOverview) => void;
}

export function dosenTableColumns({ data, onDelete }: DosenTableActions) {
  // Value prodi unique dari semua data
  const prodiOptions = [...new Set(data.map((row) => row.prodi))].sort();

  return columnHelper.columns([
    columnHelper.accessor((row) => `${row.namaLengkap} ${row.nip}`, {
      id: "search",
      enableHiding: false,
      filterFn: "includesString",
    }),

    columnHelper.accessor("namaLengkap", {
      header: ({ column }) => <DataColumnSort column={column} title="Nama Lengkap" />,
      cell: ({ row, getValue }) => {
        const nama = getValue();
        const nip = row.original.nip;
        const fotoProfil = row.original.fotoProfil;

        return (
          <div className="flex gap-4 items-center">
            <Avatar size="lg">
              <AvatarImage src={fotoProfil || ""} />
              <AvatarFallback>{generateNameInitials(nama)}</AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="font-medium">{nama}</p>
              <p className="text-muted-foreground">{nip}</p>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("prodi", {
      header: ({ column }) => <DataColumnFilter column={column} title="Program Studi" options={prodiOptions} />,
      filterFn: "arrHas",
    }),

    columnHelper.accessor("status", {
      id: "status",
      header: "Status",
      filterFn: "arrHas",
      cell: ({ getValue }) => {
        const status = getValue();

        return <Badge className={cn(dosenStatusStyles[status])}>{status}</Badge>;
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const dosen = row.original;

        return (
          <div className="space-x-3">
            <Link href={`/kaprodi/daftar-dosen/${dosen.id}/detail`}>
              <Button variant="outline" size="icon-sm">
                <IconEye stroke={1.75} />
              </Button>
            </Link>
            <Link href={`/kaprodi/daftar-dosen/${dosen.id}/edit`}>
              <Button variant="outline" size="icon-sm">
                <IconEdit stroke={1.75} />
              </Button>
            </Link>
            <Button variant="destructive" size="icon-sm" onClick={() => onDelete(dosen)}>
              <IconTrash stroke={1.75} />
            </Button>
          </div>
        );
      },
    }),

    columnHelper.accessor((row) => row.roles, {
      id: "role",
      filterFn: "arrIncludesSome",
    }),
  ]);
}
