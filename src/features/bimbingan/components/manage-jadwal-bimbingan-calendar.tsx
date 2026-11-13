"use client";

import { cn } from "cn";
import { id } from "date-fns/locale";
import { useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { startOfMonth } from "date-fns";
import { JadwalBimbinganDosen } from "../types";

interface JadwalBimbinganPanelProps {
  jadwalList: JadwalBimbinganDosen[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export function ManageJadwalBimbinganCalendar({ jadwalList, selectedDate, setSelectedDate }: JadwalBimbinganPanelProps) {
  const todayDate = new Date();

  const jadwalDates = useMemo(() => jadwalList.map((jadwal) => new Date(`${jadwal.tanggal}T00:00:00`)), [jadwalList]);

  return (
    <Calendar
      className={cn(
        "w-full p-3 sm:p-6",
        // Hapus focus style
        "[&_.rdp-day[data-focused=true]>button]:ring-0! [&_.rdp-day>button:focus-visible]:ring-0!",
        // Pertahankan active style
        "[&_.rdp-day>button[data-selected-single=true]:hover]:bg-primary! ",
        "[&_.rdp-day>button[data-selected-single=true]:hover]:text-primary-foreground!",
      )}
      mode="single"
      locale={id}
      selected={selectedDate}
      onSelect={(date) => date && setSelectedDate(date)}
      disabled={{ before: todayDate }}
      startMonth={startOfMonth(todayDate)}
      modifiers={{ hasJadwal: jadwalDates }}
      modifiersClassNames={{
        hasJadwal: "ring-1 ring-primary text-sidebar-primary rounded-md! font-medium!",
      }}
      classNames={{
        month: "flex w-full flex-col gap-6 rdp-month",
        week: "flex w-full min-[400px]:mt-4 min-[400px]:gap-4 rdp-week",
        weekdays: "flex min-[400px]:gap-4 rdp-weekdays",
        today: "bg-transparent",
      }}
    />
  );
}
