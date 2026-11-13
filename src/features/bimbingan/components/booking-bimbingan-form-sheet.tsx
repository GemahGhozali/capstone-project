"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { IconBook } from "@tabler/icons-react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useBookingBimbinganForm } from "../hooks";
import { JadwalBimbinganMahasiswa } from "../types";
import { BookingBimbinganCalendar } from "./booking-bimbingan-calendar";
import { BookingBimbinganJadwalList } from "./booking-bimbingan-jadwal-list";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "@/components/ui/sheet";

interface BookingBimbinganFormSheetProps {
  jadwalList: JadwalBimbinganMahasiswa[];
}

export function BookingBimbinganFormSheet({ jadwalList }: BookingBimbinganFormSheetProps) {
  const {
    form: { control, handleSubmit, reset },
    mutation: { mutateAsync, isPending },
  } = useBookingBimbinganForm();

  const [open, setOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedJadwal, setSelectedJadwal] = useState<JadwalBimbinganMahasiswa>();

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedJadwal(undefined);
  };

  const handleClose = () => {
    reset({ catatanMahasiswa: "" });
    setOpen(false);
    setSelectedDate(new Date());
    setSelectedJadwal(undefined);
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!selectedJadwal) return;

    try {
      const bookingPayload = { jadwalId: selectedJadwal.id, data };
      await mutateAsync(bookingPayload, { onSuccess: handleClose, onError: handleClose });
    } catch {
      // Error dihandle otomatis oleh useMutation
    }
  });

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        } else {
          setOpen(true);
        }
      }}
    >
      <SheetTrigger
        render={
          <Button className="sm:ml-auto">
            Booking Bimbingan
            <IconBook data-icon="inline-end" />
          </Button>
        }
      />
      <SheetContent side="right" className="gap-0 divide-y w-full!" showCloseButton={false}>
        <SheetHeader className="p-0">
          <BookingBimbinganCalendar jadwalList={jadwalList} selectedDate={selectedDate} setSelectedDate={handleSelectDate} />
        </SheetHeader>
        <div className="p-4 overflow-y-auto flex-1">
          <BookingBimbinganJadwalList
            jadwalList={jadwalList}
            selectedDate={selectedDate}
            selectedJadwal={selectedJadwal}
            setSelectedJadwal={setSelectedJadwal}
          />
        </div>
        <SheetFooter className="p-4 mt-0 gap-3">
          {selectedJadwal && (
            <form onSubmit={onSubmit} className="space-y-3">
              <Controller
                name="catatanMahasiswa"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="catatanMahasiswa">
                      Catatan Untuk Dosen <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="catatanMahasiswa"
                      placeholder="Masukkan catatan anda untuk dosen disini..."
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      disabled={isPending}
                      className="text-sm mb-2"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Memproses" : "Booking Jadwal"}
                {isPending && <Spinner data-icon="inline-start" />}
              </Button>
            </form>
          )}
          <SheetClose render={<Button variant="outline">Batalkan</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
