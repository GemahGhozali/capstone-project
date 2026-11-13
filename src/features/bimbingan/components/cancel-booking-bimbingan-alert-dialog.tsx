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
import { useCancelBookingBimbinganForm } from "../hooks";

interface CancelBookingBimbinganAlertDialogProps {
  bookingId?: string;
  onClose: () => void;
}

export function CancelBookingBimbinganAlertDialog({ bookingId, onClose }: CancelBookingBimbinganAlertDialogProps) {
  const {
    form: { control, handleSubmit, reset },
    mutation: { mutateAsync, isPending },
  } = useCancelBookingBimbinganForm();

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
          reset({ alasanPembatalan: "" });
        }
      }}
    >
      <AlertDialogContent size="sm" className="max-w-sm!">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/15 text-destructive">
            <IconCancel />
          </AlertDialogMedia>
          <AlertDialogTitle>Pembatalan Booking Bimbingan</AlertDialogTitle>
          <AlertDialogDescription>Booking bimbingan ini akan dibatalkan! Silahkan tulis alasan pembatalan untuk anda.</AlertDialogDescription>
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
              Tutup
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" type="submit" disabled={isPending}>
              {isPending ? "Memproses" : "Batalkan"}
              {isPending && <Spinner data-icon="inline-start" />}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
