"use client";

import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { JadwalBimbinganDosen } from "../types";
import { JadwalBimbinganFormDialog } from "./jadwal-bimbingan-form-dialog";
import { ManageJadwalBimbinganList } from "./manage-jadwal-bimbingan-list";
import { ManageJadwalBimbinganCalendar } from "./manage-jadwal-bimbingan-calendar";
import { CloseJadwalBimbinganAlertDialog } from "./close-jadwal-bimbingan-alert-dialog";
import { DeleteJadwalBimbinganAlertDialog } from "./delete-jadwal-bimbingan-alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface JadwalBimbinganPanelProps {
  jadwalList: JadwalBimbinganDosen[];
}

type DialogAction = { action: "create" } | { action: "delete"; jadwal: JadwalBimbinganDosen } | { action: "close"; jadwal: JadwalBimbinganDosen };

export function ManageJadwalBimbinganPanel({ jadwalList }: JadwalBimbinganPanelProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [dialog, setDialog] = useState<DialogAction | undefined>(undefined);

  const handleCloseDialog = () => setDialog(undefined);

  const openCreateForm = dialog?.action === "create";
  const jadwalToDelete = dialog?.action === "delete" ? dialog.jadwal : undefined;
  const jadwalToClose = dialog?.action === "close" ? dialog.jadwal : undefined;

  return (
    <>
      <Card className="p-0 gap-0">
        <CardHeader className="p-6">
          <CardTitle>Kelola Jadwal Bimbingan</CardTitle>
          <CardDescription>Silahkan tentukan tanggal dan waktu bimbingan</CardDescription>
        </CardHeader>
        <CardContent className="p-0 gap-0 grid lg:grid-cols-2 *:rounded-none">
          <Card className="p-0">
            <CardContent className="p-0">
              <ManageJadwalBimbinganCalendar jadwalList={jadwalList} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex gap-3 justify-between sm:items-end max-sm:flex-col">
              <div className="space-y-1">
                <CardTitle>Waktu Bimbingan</CardTitle>
                <CardDescription>{format(selectedDate, "eeee, d MMMM yyyy", { locale: id })}</CardDescription>
              </div>
              <Button size="sm" onClick={() => setDialog({ action: "create" })} className="max-sm:w-full">
                Tambah <IconPlus data-icon="inline-end" />
              </Button>
            </CardHeader>
            <div className="lg:relative lg:flex-1 lg:min-h-0">
              <CardContent className="lg:absolute lg:inset-0">
                <ManageJadwalBimbinganList
                  jadwalList={jadwalList}
                  selectedDate={selectedDate}
                  onDelete={(jadwal) => setDialog({ action: "delete", jadwal })}
                  onClose={(jadwal) => setDialog({ action: "close", jadwal })}
                />
              </CardContent>
            </div>
          </Card>
        </CardContent>
      </Card>
      <JadwalBimbinganFormDialog open={openCreateForm} closeDialog={handleCloseDialog} selectedDate={selectedDate} />
      <DeleteJadwalBimbinganAlertDialog jadwalToDelete={jadwalToDelete} closeDialog={handleCloseDialog} />
      <CloseJadwalBimbinganAlertDialog jadwalToClose={jadwalToClose} closeDialog={handleCloseDialog} />
    </>
  );
}
