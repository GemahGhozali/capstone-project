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
import { Textarea } from "@/components/ui/textarea";
import { Controller } from "react-hook-form";
import { IconCancel } from "@tabler/icons-react";
import { Field, FieldError } from "@/components/ui/field";
import { JadwalBimbinganItem } from "../types";
import { useCloseJadwalBimbinganForm } from "../hooks";

interface CloseJadwalBimbinganAlertDialogProps {
  jadwalToClose?: JadwalBimbinganItem;
  closeDialog: () => void;
}

export function CloseJadwalBimbinganAlertDialog({ jadwalToClose, closeDialog }: CloseJadwalBimbinganAlertDialogProps) {
  const {
    form: { control, handleSubmit, reset },
    mutation: { mutateAsync, isPending },
  } = useCloseJadwalBimbinganForm();

  const onSubmit = handleSubmit(async (data) => {
    if (!jadwalToClose) return;

    try {
      await mutateAsync({ jadwalId: jadwalToClose.id, data });
      closeDialog();
    } catch {
      // Error dihandle otomatis oleh useMutation
    }
  });

  return (
    <AlertDialog
      open={jadwalToClose !== undefined}
      onOpenChange={(open) => {
        if (!open) {
          closeDialog();
          reset({ alasanPembatalan: "" });
        }
      }}
    >
      <AlertDialogContent size="sm" className="max-w-sm!">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/15 text-destructive">
            <IconCancel />
          </AlertDialogMedia>
          <AlertDialogTitle>Penutupan Jadwal Bimbingan</AlertDialogTitle>
          <AlertDialogDescription>
            Semua booking aktif di jadwal ini akan dibatalkan! Silahkan tulis alasan pembatalan untuk mahasiswa.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Controller
            name="alasanPembatalan"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Textarea
                  {...field}
                  id="alasanPembatalan"
                  placeholder="Masukkan alasan pembatalan disini..."
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  disabled={isPending}
                  className="text-sm"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <AlertDialogFooter className="flex! gap-3 max-sm:flex-col! max-sm:flex-col-reverse! sm:*:grow">
            <AlertDialogCancel variant="outline" type="button" disabled={isPending}>
              Batalkan
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" type="submit" disabled={isPending}>
              {isPending ? "Memproses" : "Tutup Jadwal"}
              {isPending && <Spinner data-icon="inline-start" />}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
