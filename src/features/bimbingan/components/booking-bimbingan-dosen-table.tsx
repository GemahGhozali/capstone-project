"use client";

import { DataTable } from "@/components/data/data-table";
import { useMemo, useState } from "react";
import { BookingBimbinganDosen } from "../types";
import { CancelBookingBimbinganAlertDialog } from "./cancel-booking-bimbingan-alert-dialog";
import { BookingBimbinganDosenTableToolbar } from "./booking-bimbingan-dosen-table-toolbar";
import { bookingBimbinganDosenTableColumns } from "./booking-bimbingan-dosen-table-columns";
import { DetailBookingBimbinganDosenDialog } from "./detail-booking-bimbingan-dosen-dialog";
import { CompleteBookingBimbinganAlertDialog } from "./complete-booking-bimbingan-alert-dialog";
import { BookingBimbinganDosenTableEmptyState } from "./booking-bimbingan-dosen-table-empty-state";

interface BookingBimbinganDosenTableProps {
  data: BookingBimbinganDosen[];
}

type TableAction =
  | { type: "cancel"; booking: BookingBimbinganDosen }
  | { type: "detail"; booking: BookingBimbinganDosen }
  | { type: "complete"; booking: BookingBimbinganDosen };

export function BookingBimbinganDosenTable({ data }: BookingBimbinganDosenTableProps) {
  const [action, setAction] = useState<TableAction | undefined>(undefined);

  const columns = useMemo(
    () =>
      bookingBimbinganDosenTableColumns({
        onCancel: (booking) => setAction({ type: "cancel", booking }),
        onSeeDetail: (booking) => setAction({ type: "detail", booking }),
        onComplete: (booking) => setAction({ type: "complete", booking }),
      }),
    [],
  );

  const resetAction = () => setAction(undefined);

  const bookingDetail = action?.type === "detail" ? action.booking : undefined;
  const bookingToCancel = action?.type === "cancel" ? action.booking.id : undefined;
  const bookingToComplete = action?.type === "complete" ? action.booking.id : undefined;

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        renderToolbar={(table) => <BookingBimbinganDosenTableToolbar table={table} />}
        renderEmptyState={(table) => <BookingBimbinganDosenTableEmptyState table={table} />}
      />
      <CancelBookingBimbinganAlertDialog bookingId={bookingToCancel} onClose={resetAction} />
      <CompleteBookingBimbinganAlertDialog bookingId={bookingToComplete} onClose={resetAction} />
      <DetailBookingBimbinganDosenDialog booking={bookingDetail} onClose={resetAction} />
    </>
  );
}
