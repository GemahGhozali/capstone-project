"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconEye } from "@tabler/icons-react";
import { DataColumnSort } from "@/components/data/data-column-sort";
import { DataColumnFilter } from "@/components/data/data-column-filter";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";
import { BimbinganMahasiswaMonitoring } from "../types";

const columnHelper = createColumnHelper<DataTableFeatures, BimbinganMahasiswaMonitoring>();

export function bimbinganMonitoringTableColumns(data: BimbinganMahasiswaMonitoring[]) {
  const dosenPembimbingOptions = [...new Set(data.map((row) => row.dosenPembimbing).filter((nama): nama is string => !!nama))].sort();

  return columnHelper.columns([
    columnHelper.accessor((row) => `${row.namaLengkap} ${row.nim} ${row.subjudul}`, {
      id: "search",
      filterFn: "includesString",
    }),

    columnHelper.accessor("nim", {
      enableHiding: false,
      header: ({ column }) => <DataColumnSort column={column} title="Mahasiswa" />,
      cell: ({ row, getValue }) => (
        <div className="space-y-0.5">
          <p className="font-medium">{row.original.namaLengkap}</p>
          <p className="text-muted-foreground">{getValue()}</p>
        </div>
      ),
    }),

    columnHelper.accessor("subjudul", {
      header: "Subjudul Resume",
      cell: ({ getValue }) => {
        const subjudul = getValue();

        if (!subjudul) {
          return <Badge className="bg-neutral-500/15 text-neutral-500">Belum Upload</Badge>;
        }

        return <span className="block min-w-48 whitespace-normal">{subjudul}</span>;
      },
    }),

    columnHelper.accessor("dosenPembimbing", {
      filterFn: "arrHas",
      header: ({ column }) => <DataColumnFilter column={column} title="Dosen Pembimbing" options={dosenPembimbingOptions} />,
      cell: ({ getValue }) => {
        const dosenPembimbing = getValue();

        if (!dosenPembimbing) {
          return <Badge className="bg-neutral-500/15 text-neutral-500">Belum Ditentukan</Badge>;
        }

        return <span>{dosenPembimbing}</span>;
      },
    }),

    columnHelper.accessor("totalBimbinganTerverifikasi", {
      header: ({ column }) => <DataColumnSort column={column} title="Total Bimbingan Terverifikasi" />,
      cell: ({ getValue }) => {
        const totalBimbinganTerverifikasi = getValue();

        if (totalBimbinganTerverifikasi === 0) {
          return <Badge className="bg-neutral-500/15 text-neutral-500">Belum Bimbingan</Badge>;
        }

        return <span>{totalBimbinganTerverifikasi} Total Bimbingan</span>;
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`/kaprodi/monitoring-bimbingan/${row.original.id}/detail`}>
          <Button variant="outline" size="icon-sm">
            <IconEye />
          </Button>
        </Link>
      ),
    }),
  ]);
}
