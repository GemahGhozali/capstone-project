"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { DataColumnSort } from "@/components/data/data-column-sort";
import { StatusBimbingan } from "@/generated/prisma/enums";
import { DataColumnFilter } from "@/components/data/data-column-filter";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";
import { bimbinganStatusStyles } from "../utils";
import { CatatanBimbinganPopover } from "./catatan-bimbingan-popover";
import { IconEdit, IconFileDescription, IconTrash } from "@tabler/icons-react";
import { BimbinganMahasiswa, BimbinganMahasiswaViewer } from "../types";

const columnHelper = createColumnHelper<DataTableFeatures, BimbinganMahasiswa>();

const StatusBimbinganOptions = Object.keys(StatusBimbingan);

interface BimbinganMahasiswaTableActions {
  viewer: BimbinganMahasiswaViewer;
  onEdit: (bimbingan: BimbinganMahasiswa) => void;
  onDelete: (bimbingan: BimbinganMahasiswa) => void;
}

export function bimbinganMahasiswaTableColumns({ viewer, onEdit, onDelete }: BimbinganMahasiswaTableActions) {
  return columnHelper.columns([
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

    columnHelper.accessor("tanggal", {
      header: ({ column }) => <DataColumnSort column={column} title="Tanggal Bimbingan" />,
      cell: ({ getValue }) => format(getValue(), "eeee, d MMMM yyyy", { locale: localeId }),
    }),

    columnHelper.accessor("status", {
      id: "status",
      filterFn: "arrHas",
      header: ({ column }) => <DataColumnFilter column={column} title="Status Review" options={StatusBimbinganOptions} />,
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
            {viewer === "Mahasiswa" && bimbingan.status === "Menunggu" && (
              <>
                <Button variant="outline" size="icon-sm" onClick={() => onEdit(bimbingan)}>
                  <IconEdit />
                </Button>

                <Button variant="destructive" size="icon-sm" onClick={() => onDelete(bimbingan)}>
                  <IconTrash />
                </Button>
              </>
            )}
          </div>
        );
      },
    }),
  ]);
}
