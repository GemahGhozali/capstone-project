"use client";

import Link from "next/link";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MahasiswaOverview } from "../types";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";
import { generateNameInitials } from "@/utils/generate-name-initials";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const columnHelper = createColumnHelper<DataTableFeatures, MahasiswaOverview>();

export interface MahasiswaTableActions {
  onDelete: (mahasiswa: MahasiswaOverview) => void;
}

export function mahasiswaTableColumns({ onDelete }: MahasiswaTableActions) {
  return columnHelper.columns([
    columnHelper.accessor("namaLengkap", {
      header: "Nama Lengkap",
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

    columnHelper.accessor("kelas.nama", {
      header: "Kelas",
    }),

    columnHelper.accessor("kelas.angkatan", {
      header: "Tahun Angkatan",
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
              status === "Arsip" && "bg-neutral-500/15 text-neutral-500",
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
        const mahasiswa = row.original;

        return (
          <div className="space-x-3">
            <Link href={`/kaprodi/daftar-mahasiswa/${mahasiswa.id}`}>
              <Button variant="outline" size="icon-sm">
                <IconEye stroke={1.75} />
              </Button>
            </Link>
            <Link href={`/kaprodi/daftar-mahasiswa/${mahasiswa.id}/edit`}>
              <Button variant="outline" size="icon-sm">
                <IconEdit stroke={1.75} />
              </Button>
            </Link>
            <Button variant="destructive" size="icon-sm" onClick={() => onDelete(mahasiswa)}>
              <IconTrash stroke={1.75} />
            </Button>
          </div>
        );
      },
    }),
  ]);
}
