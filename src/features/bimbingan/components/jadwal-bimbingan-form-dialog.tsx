"use client";

import { id } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useCreateJadwalForm } from "../hooks";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";

interface JadwalBimbinganFormDialogProps {
  open: boolean;
  closeDialog: () => void;
  selectedDate: Date;
}

export function JadwalBimbinganFormDialog({ open, closeDialog, selectedDate }: JadwalBimbinganFormDialogProps) {
  const {
    form: { control, handleSubmit, reset },
    mutation: { mutateAsync, isPending },
  } = useCreateJadwalForm();

  useEffect(() => {
    if (open) {
      reset({
        tanggal: format(selectedDate, "yyyy-MM-dd"),
        jamMulai: "",
        jamTutup: "",
        kuota: 1,
      });
    }
  }, [open, selectedDate, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync(data);
      closeDialog();
    } catch {
      // Error dihandle otomatis oleh useMutation
    }
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          closeDialog();
        }
      }}
    >
      {open && (
        <DialogContent showCloseButton={false}>
          <form onSubmit={onSubmit} className="space-y-6">
            <Controller
              name="tanggal"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="tanggal">Tanggal Bimbingan</FieldLabel>
                  <Input
                    {...field}
                    readOnly
                    disabled
                    type="text"
                    id="tanggal"
                    className="pointer-events-none"
                    value={format(selectedDate, "EEEE, d MMMM yyyy", { locale: id })}
                  />
                </Field>
              )}
            />
            <Controller
              name="jamMulai"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="jamMulai">
                    Jam Mulai <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input {...field} type="time" id="jamMulai" aria-invalid={fieldState.invalid} autoComplete="off" disabled={isPending} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="jamTutup"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="jamTutup">
                    Jam Tutup <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input {...field} type="time" id="jamTutup" aria-invalid={fieldState.invalid} autoComplete="off" disabled={isPending} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="kuota"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="kuota">
                    Kuota <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    id="kuota"
                    min={1}
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan jumlah slot kuota disini..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isPending}>
                Batalkan
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Memproses" : "Buat Jadwal"}
                {isPending && <Spinner data-icon="inline-start" />}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
