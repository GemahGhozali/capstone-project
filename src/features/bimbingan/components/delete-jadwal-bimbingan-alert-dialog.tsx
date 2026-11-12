"use client";

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogMedia,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import { Spinner } from "@/components/ui/spinner";
import { IconTrash } from "@tabler/icons-react";
import { JadwalBimbinganItem } from "../types";
import { useDeleteJadwalBimbingan } from "../hooks";

interface DeleteJadwalBimbinganAlertDialogProps {
  jadwalToDelete?: JadwalBimbinganItem;
  closeDialog: () => void;
}

export function DeleteJadwalBimbinganAlertDialog({ jadwalToDelete, closeDialog }: DeleteJadwalBimbinganAlertDialogProps) {
  const { mutateAsync, isPending } = useDeleteJadwalBimbingan();

  const handleDeleteJadwal = async () => {
    if (!jadwalToDelete) return;
    await mutateAsync(jadwalToDelete.id, { onError: closeDialog, onSuccess: closeDialog });
  };

  return (
    <AlertDialog
      open={jadwalToDelete !== undefined}
      onOpenChange={(open) => {
        if (!open) {
          closeDialog();
        }
      }}
    >
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/15 text-destructive">
            <IconTrash />
          </AlertDialogMedia>
          <AlertDialogTitle>Konfirmasi Hapus Jadwal</AlertDialogTitle>
          <AlertDialogDescription>Jadwal yang anda pilih akan dihapus secara permanen! Apakah anda yakin?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isPending}>
            Batalkan
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDeleteJadwal} disabled={isPending}>
            {isPending ? "Memproses" : "Hapus"}
            {isPending && <Spinner data-icon="inline-start" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
