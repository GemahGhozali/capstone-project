"use client";

import Link from "next/link";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DosenOverview } from "../types";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";
import { generateNameInitials } from "@/utils/generate-name-initials";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const columnHelper = createColumnHelper<DataTableFeatures, DosenOverview>();

export interface DosenTableActions {
  onDelete: (dosen: DosenOverview) => void;
}

export function dosenTableColumns({ onDelete }: DosenTableActions) {
  return columnHelper.columns([
    columnHelper.accessor("namaLengkap", {
      header: "Nama Lengkap",
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
      header: "Program Studi",
    }),

    columnHelper.accessor("status", {
      header: "Status",
      filterFn: "equalsString",
      cell: ({ row }) => {
        const { status } = row.original;

        return (
          <Badge
            className={cn(
              status === "Aktif" && "bg-green-500/15 text-green-500",
              status === "Nonaktif" && "bg-red-500/15 text-red-500",
              status === "Pindah" && "bg-neutral-500/15 text-neutral-500",
            )}
          >
            {status}
          </Badge>
        );
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const dosen = row.original;

        return (
          <div className="space-x-3">
            <Link href={`/kaprodi/daftar-dosen/${dosen.id}`}>
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
      filterFn: (row, columnId, filterValue) => (row.getValue(columnId) as string[]).includes(filterValue as string),
    }),
  ]);
}
