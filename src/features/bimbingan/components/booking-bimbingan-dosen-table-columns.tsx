"use client";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";
import { bookingStatusStyles } from "../utils";
import { BookingBimbinganDosen } from "../types";
import { IconCancel, IconCheck, IconEye } from "@tabler/icons-react";

const columnHelper = createColumnHelper<DataTableFeatures, BookingBimbinganDosen>();

export interface BookingBimbinganDosenTableActions {
  onCancel: (booking: BookingBimbinganDosen) => void;
  onSeeDetail: (booking: BookingBimbinganDosen) => void;
  onComplete: (booking: BookingBimbinganDosen) => void;
}

export function bookingBimbinganDosenTableColumns({ onCancel, onSeeDetail, onComplete }: BookingBimbinganDosenTableActions) {
  return columnHelper.columns([
    columnHelper.accessor((row) => `${row.mahasiswa.namaLengkap} ${row.mahasiswa.nim}`, {
      id: "mahasiswa",
      header: "Mahasiswa",
      filterFn: "includesString",
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <p className="font-medium line-clamp-1">{row.original.mahasiswa.namaLengkap}</p>
          <p className="text-muted-foreground">{row.original.mahasiswa.nim}</p>
        </div>
      ),
    }),

    columnHelper.accessor("jadwal.tanggal", {
      header: "Tanggal Bimbingan",
      cell: ({ getValue }) => format(getValue(), "eeee, d MMMM yyyy", { locale: localeId }),
    }),

    columnHelper.accessor("jadwal.jamMulai", {
      header: "Waktu Bimbingan",
      cell: ({ row }) => (
        <span>
          {row.original.jadwal.jamMulai} - {row.original.jadwal.jamTutup}
        </span>
      ),
    }),

    columnHelper.accessor("status", {
      header: "Status",
      filterFn: "equalsString",
      cell: ({ getValue }) => {
        const status = getValue();

        return <Badge className={cn(bookingStatusStyles[status])}>{status}</Badge>;
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const booking = row.original;

        return (
          <div className="flex gap-2">
            <Button variant="outline" size="icon-sm" onClick={() => onSeeDetail(booking)}>
              <IconEye />
            </Button>
            {booking.status === "Dipesan" && (
              <>
                <Button variant="destructive" size="icon-sm" onClick={() => onCancel(booking)}>
                  <IconCancel />
                </Button>
                <Button variant="success" size="icon-sm" onClick={() => onComplete(booking)}>
                  <IconCheck />
                </Button>
              </>
            )}
          </div>
        );
      },
    }),
  ]);
}
