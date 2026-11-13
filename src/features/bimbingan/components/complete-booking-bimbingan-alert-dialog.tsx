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
import { IconCircleCheck } from "@tabler/icons-react";
import { Field, FieldError } from "@/components/ui/field";
import { useCompleteBookingBimbinganForm } from "../hooks";

interface CompleteBookingBimbinganAlertDialogProps {
  bookingId?: string;
  onClose: () => void;
}

export function CompleteBookingBimbinganAlertDialog({ bookingId, onClose }: CompleteBookingBimbinganAlertDialogProps) {
  const {
    form: { control, handleSubmit, reset },
    mutation: { mutateAsync, isPending },
  } = useCompleteBookingBimbinganForm();

  const onSubmit = handleSubmit(async (data) => {
    if (!bookingId) return;

    try {
      await mutateAsync({ bookingId, data });
      onClose();
    } catch {
      // Error dihandle otomatis oleh useMutation
    }
  });

  return (
    <AlertDialog
      open={bookingId !== undefined}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          reset({ catatanDosen: "" });
        }
      }}
    >
      <AlertDialogContent size="sm" className="max-w-sm!">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-green-500/15 text-green-500">
            <IconCircleCheck />
          </AlertDialogMedia>
          <AlertDialogTitle>Booking Bimbingan Selesai</AlertDialogTitle>
          <AlertDialogDescription>Booking bimbingan ini akan ditandai selesai! Silahkan tulis catatan anda untuk mahasiswa.</AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Controller
            name="catatanDosen"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Textarea
                  {...field}
                  id="catatanDosen"
                  placeholder="Masukkan catatan dosen disini..."
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
            <AlertDialogAction variant="success" type="submit" disabled={isPending}>
              {isPending ? "Memproses" : "Tandai Selesai"}
              {isPending && <Spinner data-icon="inline-start" />}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
