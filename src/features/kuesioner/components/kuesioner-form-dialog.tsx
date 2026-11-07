"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useKuesionerForm } from "../hooks";
import { KuesionerOverview } from "../types";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface KuesionerFormDialogProps {
  open: boolean;
  kuesioner?: KuesionerOverview;
  closeDialog: () => void;
}

export function KuesionerFormDialog({ kuesioner, open, closeDialog }: KuesionerFormDialogProps) {
  const isEditMode = Boolean(kuesioner);

  const {
    form: { control, handleSubmit, reset },
    mutation: { mutateAsync, isPending },
  } = useKuesionerForm({ kuesioner });

  useEffect(() => {
    if (open) {
      reset({
        judul: kuesioner?.judul ?? "",
        periode: kuesioner?.periode ?? "",
        deskripsi: kuesioner?.deskripsi ?? "",
      });
    }
  }, [open, kuesioner, reset]);

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
        <DialogContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Kuesioner" : "Tambah Kuesioner"}</DialogTitle>
              <DialogDescription>
                {isEditMode ? "Ubah judul, periode, dan deskripsi kuesioner" : "Tentukan judul, periode dan deskripsi kuesioner"}
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              {/* Judul */}
              <Controller
                name="judul"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="judul">
                      Judul Kuesioner <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      id="judul"
                      autoComplete="off"
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                      placeholder="Masukkan judul kuesioner disini..."
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Periode */}
              <Controller
                name="periode"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="periode">
                      Periode <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      id="periode"
                      autoComplete="off"
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                      placeholder="Masukkan periode kuesioner disini..."
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Deskripsi */}
              <Controller
                name="deskripsi"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="deskripsi">Deskripsi (Opsional)</FieldLabel>
                    <Textarea
                      {...field}
                      id="deskripsi"
                      rows={3}
                      autoComplete="off"
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                      placeholder="Masukkan deskripsi kuesioner disini..."
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isPending}>
                Batalkan
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Memproses" : isEditMode ? "Simpan Perubahan" : "Tambah Kuesioner"}
                {isPending && <Spinner data-icon="inline-start" />}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
