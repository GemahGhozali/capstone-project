"use client";

import Link from "next/link";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataColumnSort } from "@/components/data/data-column-sort";
import { DataColumnFilter } from "@/components/data/data-column-filter";
import { MahasiswaOverview } from "../types";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";
import { generateNameInitials } from "@/utils/generate-name-initials";
import { mahasiswaStatusStyles } from "../utils";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const columnHelper = createColumnHelper<DataTableFeatures, MahasiswaOverview>();

export interface MahasiswaTableActions {
  data: MahasiswaOverview[];
  onDelete: (mahasiswa: MahasiswaOverview) => void;
}

export function mahasiswaTableColumns({ data, onDelete }: MahasiswaTableActions) {
  // Value kelas unique dari semua data
  const kelasOptions = [...new Set(data.map((row) => row.kelas.nama))].sort();

  // Value angkatan unique dari semua data
  const angkatanOptions = [...new Set(data.map((row) => String(row.kelas.angkatan)))].sort();

  return columnHelper.columns([
    columnHelper.accessor((row) => `${row.namaLengkap} ${row.nim}`, {
      id: "search",
      enableHiding: false,
      filterFn: "includesString",
    }),

    columnHelper.accessor("nim", {
      header: ({ column }) => <DataColumnSort column={column} title="Nama Lengkap" />,
      cell: ({ row, getValue }) => {
        const nim = getValue();
        const namaLengkap = row.original.namaLengkap;
        const fotoProfil = row.original.fotoProfil;

        return (
          <div className="flex gap-4 items-center">
            <Avatar size="lg">
              <AvatarImage src={fotoProfil || ""} />
              <AvatarFallback>{generateNameInitials(namaLengkap)}</AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="font-medium">{namaLengkap}</p>
              <p className="text-muted-foreground">{nim}</p>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor("kelas.nama", {
      header: ({ column }) => <DataColumnFilter column={column} title="Kelas" options={kelasOptions} />,
      filterFn: "arrHas",
    }),

    columnHelper.accessor((row) => String(row.kelas.angkatan), {
      id: "kelas.angkatan",
      header: ({ column }) => <DataColumnFilter column={column} title="Tahun Angkatan" options={angkatanOptions} />,
      filterFn: "arrHas",
    }),

    columnHelper.accessor("status", {
      id: "status",
      header: "Status",
      filterFn: "equalsString",
      cell: ({ getValue }) => {
        const status = getValue();

        return <Badge className={cn(mahasiswaStatusStyles[status])}>{status}</Badge>;
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const mahasiswa = row.original;

        return (
          <div className="space-x-3">
            <Link href={`/kaprodi/daftar-mahasiswa/${mahasiswa.id}/detail`}>
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
