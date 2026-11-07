"use client";

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogMedia,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import { Spinner } from "@/components/ui/spinner";
import { IconTrash } from "@tabler/icons-react";
import { PertanyaanKuesioner } from "../types";
import { useDeletePertanyaan } from "../hooks";

interface DeletePertanyaanAlertDialogProps {
  pertanyaanToDelete?: PertanyaanKuesioner;
  closeDialog: () => void;
}

export function DeletePertanyaanAlertDialog({ pertanyaanToDelete, closeDialog }: DeletePertanyaanAlertDialogProps) {
  const { mutateAsync, isPending } = useDeletePertanyaan();

  const handleDeletePertanyaan = async () => {
    if (!pertanyaanToDelete) return;
    await mutateAsync(pertanyaanToDelete.id);
    closeDialog();
  };

  return (
    <AlertDialog
      open={pertanyaanToDelete !== undefined}
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
          <AlertDialogTitle>Konfirmasi Hapus Pertanyaan</AlertDialogTitle>
          <AlertDialogDescription>Pertanyaan yang anda pilih akan dihapus secara permanen! Apakah anda yakin?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isPending}>
            Batalkan
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDeletePertanyaan} disabled={isPending}>
            {isPending ? "Memproses" : "Hapus"}
            {isPending && <Spinner data-icon="inline-start" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
