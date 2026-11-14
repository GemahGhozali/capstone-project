"use client";

import Link from "next/link";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";
import { jadwalStatusStyles } from "../utils";
import { JadwalBimbinganDosen } from "../types";
import { IconCancel, IconEye, IconLockOpen, IconTrash } from "@tabler/icons-react";

const columnHelper = createColumnHelper<DataTableFeatures, JadwalBimbinganDosen>();

export interface JadwalBimbinganTableActions {
  onOpenAgain: (jadwal: JadwalBimbinganDosen) => void;
  onCloseJadwal: (jadwal: JadwalBimbinganDosen) => void;
  onDelete: (jadwal: JadwalBimbinganDosen) => void;
}

export function jadwalBimbinganTableColumns({ onOpenAgain, onCloseJadwal, onDelete }: JadwalBimbinganTableActions) {
  return columnHelper.columns([
    columnHelper.accessor("tanggal", {
      header: "Tanggal Bimbingan",
      cell: ({ getValue }) => format(getValue(), "eeee, d MMMM yyyy", { locale: localeId }),
    }),

    columnHelper.accessor("jamMulai", {
      header: "Waktu Bimbingan",
      cell: ({ row }) => (
        <span>
          {row.original.jamMulai} - {row.original.jamTutup}
        </span>
      ),
    }),

    columnHelper.accessor("totalBooking", {
      header: "Kuota",
      cell: ({ row }) => {
        const jadwal = row.original;

        return (
          <span className={cn(jadwal.status === "Ditutup" && "text-destructive")}>
            {jadwal.status === "Ditutup" ? "Ditutup" : `${jadwal.totalBooking}/${jadwal.kuota}`}
          </span>
        );
      },
    }),

    columnHelper.accessor("status", {
      header: "Status",
      filterFn: "equalsString",
      cell: ({ getValue }) => {
        const status = getValue();

        return <Badge className={cn(jadwalStatusStyles[status])}>{status}</Badge>;
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const jadwal = row.original;

        return (
          <div className="flex gap-2">
            <Link href={`/dosen-pembimbing/jadwal-bimbingan/${jadwal.id}/detail`}>
              <Button variant="outline" size="icon-sm" aria-label="Lihat detail jadwal">
                <IconEye />
              </Button>
            </Link>
            {jadwal.status === "Ditutup" && !jadwal.timeHasPassed && (
              <Button variant="success" size="icon-sm" onClick={() => onOpenAgain(jadwal)} aria-label="Buka kembali jadwal">
                <IconLockOpen />
              </Button>
            )}
            {jadwal.status === "Aktif" && jadwal.totalBooking > 0 && (
              <Button variant="destructive" size="icon-sm" onClick={() => onCloseJadwal(jadwal)} aria-label="Tutup jadwal">
                <IconCancel />
              </Button>
            )}
            {jadwal.status === "Aktif" && jadwal.totalBooking === 0 && (
              <Button variant="destructive" size="icon-sm" onClick={() => onDelete(jadwal)} aria-label="Hapus jadwal">
                <IconTrash />
              </Button>
            )}
          </div>
        );
      },
    }),
  ]);
}
