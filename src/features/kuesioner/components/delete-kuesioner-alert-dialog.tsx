"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Spinner } from "@/components/ui/spinner";
import { IconTrash } from "@tabler/icons-react";
import { KuesionerOverview } from "../types";
import { useDeleteKuesioner } from "../hooks";

interface DeleteKuesionerAlertDialogProps {
  kuesionerToDelete?: KuesionerOverview;
  closeDialog: () => void;
}

export function DeleteKuesionerAlertDialog({ kuesionerToDelete, closeDialog }: DeleteKuesionerAlertDialogProps) {
  const { mutateAsync, isPending } = useDeleteKuesioner();

  const handleDeleteKuesioner = async () => {
    if (!kuesionerToDelete) return;
    await mutateAsync(kuesionerToDelete.id);
    closeDialog();
  };

  return (
    <AlertDialog
      open={kuesionerToDelete !== undefined}
      onOpenChange={(open) => {
        if (!open) {
          closeDialog();
        }
      }}
    >
      <AlertDialogContent size="sm" className="max-w-sm!">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <IconTrash />
          </AlertDialogMedia>
          <AlertDialogTitle>Konfirmasi Hapus Kuesioner</AlertDialogTitle>
          <AlertDialogDescription>
            Kuesioner <span className="font-medium">"{kuesionerToDelete?.judul ?? "ini"}"</span> akan dihapus secara permanen! Apakah anda yakin?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isPending}>
            Batalkan
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDeleteKuesioner} disabled={isPending}>
            {isPending ? "Memproses" : "Hapus"}
            {isPending && <Spinner data-icon="inline-start" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
