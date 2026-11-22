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
import { NilaiMahasiswa } from "../types";
import { useDeletePenilaian } from "../hooks";

interface DeletePenilaianAlertDialogProps {
  mahasiswa?: NilaiMahasiswa;
  closeDialog: () => void;
}

export function DeletePenilaianAlertDialog({ mahasiswa, closeDialog }: DeletePenilaianAlertDialogProps) {
  const { mutateAsync, isPending } = useDeletePenilaian();

  const handleDelete = async () => {
    if (!mahasiswa || mahasiswa.nilai === null) return;
    await mutateAsync(mahasiswa.id);
    closeDialog();
  };

  return (
    <AlertDialog
      open={mahasiswa !== undefined}
      onOpenChange={(open) => {
        if (!open) closeDialog();
      }}
    >
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <IconTrash />
          </AlertDialogMedia>
          <AlertDialogTitle>Batalkan Nilai Mahasiswa</AlertDialogTitle>
          <AlertDialogDescription>
            Nilai <span className="font-medium">{mahasiswa?.namaLengkap ?? "mahasiswa"}</span> akan dihapus.
            {mahasiswa?.status === "Tuntas" && " Status mahasiswa akan dikembalikan menjadi Aktif."} Apakah Anda yakin?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isPending}>
            Batalkan
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? "Memproses" : "Hapus Nilai"}
            {isPending && <Spinner data-icon="inline-start" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
