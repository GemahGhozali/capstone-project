"use client";

import { cn } from "cn";
import { id } from "date-fns/locale";
import { useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfMonth } from "date-fns";
import { JadwalBimbinganMahasiswa } from "../types";

interface BookingBimbinganCalendarProps {
  jadwalList: JadwalBimbinganMahasiswa[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export function BookingBimbinganCalendar({ jadwalList, selectedDate, setSelectedDate }: BookingBimbinganCalendarProps) {
  const todayDate = new Date();

  const jadwalDates = useMemo(() => new Set(jadwalList.map((jadwal) => jadwal.tanggal)), [jadwalList]);

  const bookedDates = useMemo(() => new Set(jadwalList.filter((jadwal) => jadwal.isBooked).map((jadwal) => jadwal.tanggal)), [jadwalList]);

  return (
    <Calendar
      locale={id}
      mode="single"
      selected={selectedDate}
      onSelect={(date) => date && setSelectedDate(date)}
      disabled={[{ before: todayDate }, (date) => !jadwalDates.has(format(date, "yyyy-MM-dd"))]}
      startMonth={startOfMonth(todayDate)}
      modifiers={{ hasBooking: (date) => bookedDates.has(format(date, "yyyy-MM-dd")) }}
      modifiersClassNames={{
        hasBooking: "ring-1 ring-primary text-sidebar-primary rounded-md! font-medium!",
      }}
      classNames={{
        month: "flex w-full flex-col gap-6 rdp-month",
        week: "flex w-full mt-1.5 gap-1.5 rdp-week",
        weekdays: "flex gap-1.5 rdp-weekdays",
        today: "bg-transparent",
      }}
      className={cn(
        "w-full bg-card p-4",
        // Hapus focus style
        "[&_.rdp-day[data-focused=true]>button]:ring-0! [&_.rdp-day>button:focus-visible]:ring-0!",

        // Menghilangkan aspect-square dan membuat tinggi fix pada button
        "[&_.rdp-day]:aspect-auto! [&_.rdp-day>button]:aspect-auto! [&_.rdp-day>button]:h-9!",

        // Pertahankan active style
        "[&_.rdp-day>button[data-selected-single=true]:hover]:bg-primary! ",
        "[&_.rdp-day>button[data-selected-single=true]:hover]:text-primary-foreground!",
      )}
    />
  );
}
