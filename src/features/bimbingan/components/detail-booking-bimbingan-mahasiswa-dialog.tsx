"use client";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { bookingStatusStyles } from "../utils";
import { BookingBimbinganMahasiswa } from "../types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DetailBookingBimbinganMahasiswaDialogProps {
  booking?: BookingBimbinganMahasiswa;
  onClose: () => void;
}

export function DetailBookingBimbinganMahasiswaDialog({ booking, onClose }: DetailBookingBimbinganMahasiswaDialogProps) {
  return (
    <Dialog
      open={booking !== undefined}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-lg! p-0 gap-0">
        {booking && (
          <>
            <DialogHeader className="p-6 border-b">
              <Badge className={cn(bookingStatusStyles[booking.status], "mb-1")}>{booking.status}</Badge>
              <DialogTitle>Detail Jadwal Bimbingan</DialogTitle>
              <DialogDescription>Informasi jadwal bimbingan anda.</DialogDescription>
            </DialogHeader>
            <div className="p-6 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <p className="text-muted-foreground text-xs">Tanggal Bimbingan</p>
                  <p className=" font-medium">{format(booking.jadwal.tanggal, "eeee, d MMMM yyyy", { locale: localeId })}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-muted-foreground text-xs">Waktu Bimbingan</p>
                  <p className=" font-medium">
                    {booking.jadwal.jamMulai} - {booking.jadwal.jamTutup}
                  </p>
                </div>
              </div>
              <Accordion className="gap-0 border rounded-md">
                <AccordionItem>
                  <AccordionTrigger className="hover:no-underline p-4">Catatan Mahasiswa</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p className="whitespace-pre-line text-muted-foreground">{booking.catatanMahasiswa}</p>
                  </AccordionContent>
                </AccordionItem>
                {booking.catatanDosen && (
                  <AccordionItem>
                    <AccordionTrigger className="hover:no-underline p-4">Catatan Dosen</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p className="whitespace-pre-line text-muted-foreground">{booking.catatanDosen}</p>
                    </AccordionContent>
                  </AccordionItem>
                )}
                {booking.status === "Dibatalkan" && (
                  <AccordionItem>
                    <AccordionTrigger className="hover:no-underline p-4">Alasan Pembatalan</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 text-muted-foreground">
                      Dari {booking.dibatalkanOleh} : {booking.alasanPembatalan}
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
