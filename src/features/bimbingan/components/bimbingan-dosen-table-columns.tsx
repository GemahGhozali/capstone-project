"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { DataColumnSort } from "@/components/data/data-column-sort";
import { DataColumnFilter } from "@/components/data/data-column-filter";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";
import { IconFileDescription } from "@tabler/icons-react";
import { bimbinganStatusStyles } from "../utils";
import { VerifyBimbinganButton } from "./verifiy-bimbingan-button";
import { CatatanBimbinganPopover } from "./catatan-bimbingan-popover";
import { BimbinganDosenPembimbing } from "../types";

const columnHelper = createColumnHelper<DataTableFeatures, BimbinganDosenPembimbing>();

interface BimbinganDosenTableColumnsProps {
  data: BimbinganDosenPembimbing[];
}

export function bimbinganDosenTableColumns({ data }: BimbinganDosenTableColumnsProps) {
  const mahasiswaOptions = [...new Set(data.map((row) => row.mahasiswa.namaLengkap))].sort();

  return columnHelper.columns([
    columnHelper.accessor((row) => `${row.mahasiswa.namaLengkap} ${row.mahasiswa.nim}`, {
      id: "search",
      filterFn: "includesString",
    }),

    columnHelper.accessor("catatan", {
      header: "Catatan Bimbingan",
      cell: ({ getValue }) => {
        const catatan = getValue();

        return (
          <div className="block min-w-48 max-w-100 whitespace-normal space-y-1">
            <p className="line-clamp-1">{catatan}</p>
            <CatatanBimbinganPopover catatan={catatan} />
          </div>
        );
      },
    }),

    columnHelper.accessor("mahasiswa.namaLengkap", {
      filterFn: "arrHas",
      header: ({ column }) => <DataColumnFilter column={column} title="Mahasiswa" options={mahasiswaOptions} />,
      cell: ({ row, getValue }) => (
        <div className="space-y-0.5">
          <p className="font-medium">{getValue()}</p>
          <p className="text-muted-foreground">{row.original.mahasiswa.nim}</p>
        </div>
      ),
    }),

    columnHelper.accessor("tanggal", {
      header: ({ column }) => <DataColumnSort column={column} title="Tanggal Bimbingan" />,
      cell: ({ getValue }) => format(getValue(), "d MMMM yyyy", { locale: localeId }),
    }),

    columnHelper.accessor("status", {
      id: "status",
      header: "Status",
      filterFn: "arrHas",
      cell: ({ getValue }) => {
        const status = getValue();
        return <Badge className={bimbinganStatusStyles[status]}>{status}</Badge>;
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const bimbingan = row.original;

        return (
          <div className="space-x-3">
            <Link href={bimbingan.filePath} target="_blank">
              <Button variant="outline" size="icon-sm">
                <IconFileDescription />
              </Button>
            </Link>
            <VerifyBimbinganButton id={bimbingan.id} status={bimbingan.status} />
          </div>
        );
      },
    }),
  ]);
}
