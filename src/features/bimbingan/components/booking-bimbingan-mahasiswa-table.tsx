"use client";

import { DataTable } from "@/components/data/data-table";
import { useMemo, useState } from "react";
import { CancelBookingBimbinganAlertDialog } from "./cancel-booking-bimbingan-alert-dialog";
import { BookingBimbinganMahasiswaTableToolbar } from "./booking-bimbingan-mahasiswa-table-toolbar";
import { bookingBimbinganMahasiswaTableColumns } from "./booking-bimbingan-mahasiswa-table-columns";
import { DetailBookingBimbinganMahasiswaDialog } from "./detail-booking-bimbingan-mahasiswa-dialog";
import { BookingBimbinganMahasiswaTableEmptyState } from "./booking-bimbingan-mahasiswa-table-empty-state";
import { BookingBimbinganMahasiswa, JadwalBimbinganMahasiswa } from "../types";

interface BookingBimbinganMahasiswaTableProps {
  bookingBimbinganMahasiswa: BookingBimbinganMahasiswa[];
  jadwalBimbinganMahasiswa: JadwalBimbinganMahasiswa[];
}

type TableAction = { type: "cancel"; booking: BookingBimbinganMahasiswa } | { type: "detail"; booking: BookingBimbinganMahasiswa };

export function BookingBimbinganMahasiswaTable({ bookingBimbinganMahasiswa, jadwalBimbinganMahasiswa }: BookingBimbinganMahasiswaTableProps) {
  const [action, setAction] = useState<TableAction | undefined>(undefined);

  const columns = useMemo(
    () =>
      bookingBimbinganMahasiswaTableColumns({
        onCancel: (booking) => setAction({ type: "cancel", booking }),
        onSeeDetail: (booking) => setAction({ type: "detail", booking }),
      }),
    [],
  );

  const resetAction = () => setAction(undefined);

  const bookingDetail = action?.type === "detail" ? action.booking : undefined;
  const bookingToCancel = action?.type === "cancel" ? action.booking.id : undefined;

  return (
    <>
      <DataTable
        data={bookingBimbinganMahasiswa}
        columns={columns}
        renderToolbar={(table) => <BookingBimbinganMahasiswaTableToolbar table={table} jadwalList={jadwalBimbinganMahasiswa} />}
        renderEmptyState={(table) => <BookingBimbinganMahasiswaTableEmptyState table={table} />}
      />
      <CancelBookingBimbinganAlertDialog bookingId={bookingToCancel} onClose={resetAction} />
      <DetailBookingBimbinganMahasiswaDialog booking={bookingDetail} onClose={resetAction} />
    </>
  );
}
