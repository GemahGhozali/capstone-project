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
import { DosenOverview } from "../types";
import { useDeleteDosen } from "../hooks";

interface DeleteDosenAlertDialogProps {
  dosenToDelete?: DosenOverview;
  setDosenToDelete: (dosen?: DosenOverview) => void;
}

export function DeleteDosenAlertDialog({ dosenToDelete, setDosenToDelete }: DeleteDosenAlertDialogProps) {
  const { mutateAsync, isPending } = useDeleteDosen();

  const handleDeleteDosen = async () => {
    if (!dosenToDelete) return;
    await mutateAsync(dosenToDelete.id);
    setDosenToDelete(undefined);
  };

  return (
    <AlertDialog
      open={dosenToDelete !== undefined}
      onOpenChange={(open) => {
        if (!open) {
          setDosenToDelete(undefined);
        }
      }}
    >
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <IconTrash />
          </AlertDialogMedia>
          <AlertDialogTitle>Konfirmasi Hapus Dosen</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium">{dosenToDelete?.namaLengkap ?? "Data dosen"}</span> akan dihapus secara permanen! Apakah anda yakin?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isPending}>
            Batalkan
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDeleteDosen} disabled={isPending}>
            {isPending ? "Memproses" : "Hapus"}
            {isPending && <Spinner data-icon="inline-start" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
