"use client";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";
import { bookingStatusStyles } from "../utils";
import { IconCancel, IconEye } from "@tabler/icons-react";
import { BookingBimbinganMahasiswa } from "../types";

const columnHelper = createColumnHelper<DataTableFeatures, BookingBimbinganMahasiswa>();

export interface BookingBimbinganMahasiswaTableActions {
  onCancel: (booking: BookingBimbinganMahasiswa) => void;
  onSeeDetail: (booking: BookingBimbinganMahasiswa) => void;
}

export function bookingBimbinganMahasiswaTableColumns({ onCancel, onSeeDetail }: BookingBimbinganMahasiswaTableActions) {
  return columnHelper.columns([
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
            <Button variant="outline" size="icon-sm" onClick={() => onSeeDetail(booking)} aria-label="Lihat detail booking">
              <IconEye />
            </Button>
            {booking.status === "Dipesan" && (
              <Button variant="destructive" size="icon-sm" onClick={() => onCancel(booking)} aria-label="Batalkan booking">
                <IconCancel />
              </Button>
            )}
          </div>
        );
      },
    }),
  ]);
}
