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
import { MahasiswaOverview } from "../types";
import { useDeleteMahasiswa } from "../hooks";

interface DeleteMahasiswaAlertDialogProps {
  mahasiswaToDelete?: MahasiswaOverview;
  setMahasiswaToDelete: (mahasiswa?: MahasiswaOverview) => void;
}

export function DeleteMahasiswaAlertDialog({ mahasiswaToDelete, setMahasiswaToDelete }: DeleteMahasiswaAlertDialogProps) {
  const { mutateAsync, isPending } = useDeleteMahasiswa();

  const handleDeleteMahasiswa = async () => {
    if (!mahasiswaToDelete) return;
    await mutateAsync(mahasiswaToDelete.id);
    setMahasiswaToDelete(undefined);
  };

  return (
    <AlertDialog
      open={mahasiswaToDelete !== undefined}
      onOpenChange={(open) => {
        if (!open) {
          setMahasiswaToDelete(undefined);
        }
      }}
    >
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <IconTrash />
          </AlertDialogMedia>
          <AlertDialogTitle>Konfirmasi Hapus Mahasiswa</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium">{mahasiswaToDelete?.namaLengkap ?? "Data mahasiswa"}</span> akan dihapus secara permanen! Apakah anda yakin?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isPending}>
            Batalkan
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDeleteMahasiswa} disabled={isPending}>
            {isPending ? "Memproses" : "Hapus"}
            {isPending && <Spinner data-icon="inline-start" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
