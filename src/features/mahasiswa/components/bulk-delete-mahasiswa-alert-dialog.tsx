"use client";

import {
  AlertDialog,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { IconTrash } from "@tabler/icons-react";
import { useBulkDeleteMahasiswa } from "../hooks";

interface BulkDeleteMahasiswaAlertDialogProps {
  mahasiswaIds: string[];
  onDeleteSuccess: () => void;
}

export function BulkDeleteMahasiswaAlertDialog({ mahasiswaIds, onDeleteSuccess }: BulkDeleteMahasiswaAlertDialogProps) {
  const [open, setOpen] = useState(false);

  const { mutateAsync: bulkDeleteMahasiswa, isPending } = useBulkDeleteMahasiswa();

  const handleDeleteMahasiswa = async () => {
    await bulkDeleteMahasiswa(mahasiswaIds, {
      onSuccess: () => {
        setOpen(false);
        onDeleteSuccess();
      },
      onError: () => {
        setOpen(false);
        onDeleteSuccess();
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="destructive" disabled={isPending}>
            Hapus Data <IconTrash data-icon="inline-end" />
          </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <IconTrash />
          </AlertDialogMedia>
          <AlertDialogTitle>Konfirmasi Hapus Mahasiswa</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium">{mahasiswaIds.length} mahasiswa</span> yang dipilih akan dihapus secara permanen! Apakah anda yakin?
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
