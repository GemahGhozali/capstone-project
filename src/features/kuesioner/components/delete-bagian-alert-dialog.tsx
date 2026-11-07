"use client";

import {
  AlertDialog,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import { Spinner } from "@/components/ui/spinner";
import { IconTrash } from "@tabler/icons-react";
import { BagianKuesioner } from "../types";
import { useDeleteBagian } from "../hooks";

interface DeleteBagianAlertDialogProps {
  bagianToDelete?: BagianKuesioner;
  closeDialog: () => void;
}

export function DeleteBagianAlertDialog({ bagianToDelete, closeDialog }: DeleteBagianAlertDialogProps) {
  const { mutateAsync, isPending } = useDeleteBagian();

  const handleDeleteBagian = async () => {
    if (!bagianToDelete) return;
    await mutateAsync(bagianToDelete.id);
    closeDialog();
  };

  const judul = bagianToDelete ? `"${bagianToDelete.judul}"` : "kuesioner ini";

  return (
    <AlertDialog
      open={bagianToDelete !== undefined}
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
          <AlertDialogTitle>Konfirmasi Hapus Bagian</AlertDialogTitle>
          <AlertDialogDescription>
            Bagian <span className="font-medium">{judul}</span> beserta semua pertanyaan di dalamnya akan dihapus secara permanen! Apakah anda yakin?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isPending}>
            Batalkan
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDeleteBagian} disabled={isPending}>
            {isPending ? "Memproses" : "Hapus"}
            {isPending && <Spinner data-icon="inline-start" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
