"use client";

import {
  AlertDialog,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import { Spinner } from "@/components/ui/spinner";
import { IconTrash } from "@tabler/icons-react";
import { useDeleteBimbingan } from "../hooks";
import { BimbinganMahasiswa } from "../types";

interface DeleteBimbinganAlertDialogProps {
  bimbingan?: BimbinganMahasiswa;
  closeDialog: () => void;
}

export function DeleteBimbinganAlertDialog({ bimbingan, closeDialog }: DeleteBimbinganAlertDialogProps) {
  const { mutate, isPending } = useDeleteBimbingan();

  const handleDelete = () => {
    if (!bimbingan) return;
    mutate(bimbingan.id, { onSuccess: closeDialog, onError: closeDialog });
  };

  return (
    <AlertDialog
      open={bimbingan !== undefined}
      onOpenChange={(open) => {
        if (!open) {
          closeDialog();
        }
      }}
    >
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <IconTrash />
          </AlertDialogMedia>
          <AlertDialogTitle>Hapus Catatan Bimbingan</AlertDialogTitle>
          <AlertDialogDescription>Catatan bimbingan yang dipilih akan dihapus secara permanen! Apakah anda yakin?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isPending}>
            Batalkan
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? "Memproses" : "Hapus"}
            {isPending && <Spinner data-icon="inline-start" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
