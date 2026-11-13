"use client";

import { cn } from "cn";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useMemo } from "react";
import { IconAlarm, IconBook } from "@tabler/icons-react";
import { JadwalBimbinganMahasiswa } from "../types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface BookingBimbinganJadwalListProps {
  jadwalList: JadwalBimbinganMahasiswa[];
  selectedDate: Date;
  selectedJadwal: JadwalBimbinganMahasiswa | undefined;
  setSelectedJadwal: (jadwal: JadwalBimbinganMahasiswa) => void;
}

export function BookingBimbinganJadwalList({ jadwalList, selectedDate, selectedJadwal, setSelectedJadwal }: BookingBimbinganJadwalListProps) {
  const filteredJadwalList = useMemo(() => {
    return jadwalList.filter((jadwal) => jadwal.tanggal === format(selectedDate, "yyyy-MM-dd"));
  }, [jadwalList, selectedDate]);

  return (
    <RadioGroup
      className="gap-4"
      value={selectedJadwal?.id ?? ""}
      onValueChange={(value) => {
        const jadwal = filteredJadwalList.find((jadwal) => jadwal.id === value);
        if (jadwal) setSelectedJadwal(jadwal);
      }}
    >
      {filteredJadwalList.map((jadwal) => {
        const isFull = jadwal.totalBooking >= jadwal.kuota;
        const isClosed = jadwal.status === "Ditutup";
        const isDisabled = jadwal.timeHasPassed || jadwal.isBooked || isClosed || isFull;
        const isSelected = selectedJadwal?.id === jadwal.id;

        return (
          <Label
            key={jadwal.id}
            className={cn(
              "gap-0 flex-col items-stretch divide-y rounded-md border transition-colors",
              isSelected && "border-sidebar-primary bg-sidebar-primary/15 hover:bg-sidebar-primary/15! [&_*]:text-sidebar-primary!",
              isDisabled ? "cursor-not-allowed bg-muted/70 opacity-50 [&_*]:text-muted-foreground" : "cursor-pointer hover:bg-muted/30",
            )}
          >
            <div className="w-full p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-muted-foreground text-xs">Rentang Jam</p>
                <p className="text-sm font-medium">
                  {jadwal.jamMulai} - {jadwal.jamTutup}
                </p>
              </div>
              <RadioGroupItem value={jadwal.id} disabled={isDisabled} className="sr-only size-0" />
              <div className="space-y-0.5 text-end">
                <p className="text-muted-foreground text-xs">Kuota</p>
                <p className={cn("text-sm font-medium", jadwal.status === "Ditutup" && "text-destructive")}>
                  {jadwal.status === "Ditutup" ? "Ditutup" : `${jadwal.totalBooking}/${jadwal.kuota}`}
                </p>
              </div>
            </div>
            {jadwal.isBooked ? (
              <div className="p-4 flex justify-start items-center gap-1.5 text-xs text-muted-foreground">
                <IconBook size={16} />
                Anda sudah booking jadwal ini
              </div>
            ) : jadwal.timeHasPassed ? (
              <div className="p-4 flex justify-start items-center gap-1.5 text-xs text-muted-foreground">
                <IconAlarm size={16} />
                Waktu bimbingan sudah lewat
              </div>
            ) : null}
          </Label>
        );
      })}
    </RadioGroup>
  );
}
