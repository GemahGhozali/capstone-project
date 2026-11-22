"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NilaiMahasiswa } from "../types";
import { DataColumnSort } from "@/components/data/data-column-sort";
import { DataColumnFilter } from "@/components/data/data-column-filter";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { mahasiswaStatusStyles } from "@/features/mahasiswa/utils";

const neutralBadge = "bg-neutral-500/15 text-neutral-500";
const mahasiswaStatusOptions = ["Aktif", "Tuntas"];
const kuesionerStatusOptions = ["Sudah Mengisi", "Belum Mengisi"];

interface PenilaianTableActions {
  data: NilaiMahasiswa[];
  onEdit: (mahasiswa: NilaiMahasiswa) => void;
  onDelete: (mahasiswa: NilaiMahasiswa) => void;
}

const columnHelper = createColumnHelper<DataTableFeatures, NilaiMahasiswa>();

export function penilaianTableColumns({ data, onEdit, onDelete }: PenilaianTableActions) {
  const kelasOptions = [...new Set(data.map((row) => row.kelas.nama))].sort();
  const angkatanOptions = [...new Set(data.map((row) => String(row.kelas.angkatan)))].sort();

  return columnHelper.columns([
    columnHelper.accessor((row) => `${row.namaLengkap} ${row.nim}`, {
      id: "search",
      enableHiding: false,
      filterFn: "includesString",
    }),

    columnHelper.accessor("nim", {
      id: "nim",
      enableHiding: false,
      header: ({ column }) => <DataColumnSort column={column} title="Mahasiswa" />,
      cell: ({ row, getValue }) => (
        <div className="space-y-0.5">
          <p className="font-medium">{row.original.namaLengkap}</p>
          <p className="text-muted-foreground">{getValue()}</p>
        </div>
      ),
    }),

    columnHelper.accessor("kelas.nama", {
      header: ({ column }) => <DataColumnFilter column={column} title="Kelas" options={kelasOptions} />,
      filterFn: "arrHas",
    }),

    columnHelper.accessor((row) => String(row.kelas.angkatan), {
      id: "angkatan",
      filterFn: "arrHas",
      header: ({ column }) => <DataColumnFilter column={column} title="Angkatan" options={angkatanOptions} />,
    }),

    columnHelper.accessor("status", {
      filterFn: "arrHas",
      header: ({ column }) => <DataColumnFilter column={column} title="Status" options={mahasiswaStatusOptions} />,
      cell: ({ getValue }) => {
        const status = getValue();
        return <Badge className={mahasiswaStatusStyles[status]}>{status}</Badge>;
      },
    }),

    columnHelper.accessor((row) => (row.hasFilledKuesioner ? "Sudah Mengisi" : "Belum Mengisi"), {
      id: "statusKuesioner",
      filterFn: "arrHas",
      header: ({ column }) => <DataColumnFilter column={column} title="Status Kuesioner" options={kuesionerStatusOptions} />,
      cell: ({ getValue }) => {
        const status = getValue();
        return <Badge className={status === "Sudah Mengisi" ? "bg-green-500/15 text-green-500" : neutralBadge}>{status}</Badge>;
      },
    }),

    columnHelper.accessor("nilai", {
      header: ({ column }) => <DataColumnSort column={column} title="Nilai" />,
      cell: ({ getValue }) => getValue() ?? <Badge className={neutralBadge}>Belum Dinilai</Badge>,
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const mahasiswa = row.original;

        return (
          <div className="space-x-3">
            <Button variant="outline" size="icon-sm" onClick={() => onEdit(mahasiswa)}>
              <IconEdit />
            </Button>
            {mahasiswa.nilai !== null && (
              <Button variant="destructive" size="icon-sm" onClick={() => onDelete(mahasiswa)}>
                <IconTrash />
              </Button>
            )}
          </div>
        );
      },
    }),
  ]);
}
