"use client";

import Link from "next/link";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useMemo } from "react";
import { JadwalBimbinganDosen } from "../types";
import { useOpenJadwalBimbingan } from "../hooks";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { IconBook, IconCancel, IconEye, IconLockOpen, IconTrash } from "@tabler/icons-react";

interface JadwalBimbinganPanelProps {
  jadwalList: JadwalBimbinganDosen[];
  selectedDate: Date;
  onDelete: (jadwal: JadwalBimbinganDosen) => void;
  onClose: (jadwal: JadwalBimbinganDosen) => void;
}

export function ManageJadwalBimbinganList({ jadwalList, selectedDate, onDelete, onClose }: JadwalBimbinganPanelProps) {
  const { mutate: openJadwalBimbingan } = useOpenJadwalBimbingan();

  const selectedJadwal = useMemo(() => {
    return jadwalList.filter((jadwal) => jadwal.tanggal === format(selectedDate, "yyyy-MM-dd"));
  }, [jadwalList, selectedDate]);

  if (selectedJadwal.length === 0) {
    return (
      <Empty className="border border-dashed rounded-lg px-6">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconBook />
          </EmptyMedia>
          <EmptyTitle>Tidak Ada Jadwal Bimbingan</EmptyTitle>
          <EmptyDescription>Belum ada jadwal bimbingan di tanggal ini</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6 p-[1px]">
        {selectedJadwal.map((jadwal) => (
          <Card key={jadwal.id} className="p-4 gap-4">
            <CardContent className="p-0 flex-row justify-between">
              <div className="space-y-0.5">
                <p className="text-muted-foreground text-xs">Rentang Jam</p>
                <p className="font-medium text-sm">
                  {jadwal.jamMulai} - {jadwal.jamTutup}
                </p>
              </div>
              <div className="space-y-0.5 text-end">
                <p className="text-muted-foreground text-xs">Kuota</p>
                <p className={cn("font-medium text-sm", jadwal.status === "Ditutup" && "text-destructive")}>
                  {jadwal.status === "Ditutup" ? "Ditutup" : `${jadwal.totalBooking}/${jadwal.kuota}`}
                </p>
              </div>
            </CardContent>
            <CardFooter className="p-0 gap-3 *:w-full sm:*:flex-1 max-sm:flex-col">
              <Link href={`/dosen-pembimbing/jadwal-bimbingan/${jadwal.id}/detail`}>
                <Button variant="outline" className="w-full">
                  <IconEye data-icon="inline-start" />
                  Detail
                </Button>
              </Link>
              {jadwal.status === "Ditutup" && !jadwal.timeHasPassed && (
                <Button variant="success" onClick={() => openJadwalBimbingan(jadwal.id)}>
                  <IconLockOpen data-icon="inline-start" />
                  Buka Kembali
                </Button>
              )}
              {jadwal.status === "Aktif" && jadwal.totalBooking > 0 && (
                <Button variant="destructive" onClick={() => onClose(jadwal)}>
                  <IconCancel data-icon="inline-start" />
                  Tutup
                </Button>
              )}
              {jadwal.status === "Aktif" && jadwal.totalBooking === 0 && (
                <Button variant="destructive" onClick={() => onDelete(jadwal)}>
                  <IconTrash data-icon="inline-start" />
                  Hapus
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
