"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useKelasForm } from "../hooks";
import { KelasOverview } from "../types";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface KelasFormDialogProps {
  kelas?: KelasOverview;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KelasFormDialog({ kelas, open, onOpenChange }: KelasFormDialogProps) {
  const {
    form: { control, handleSubmit, reset },
    mutation: { mutateAsync, isPending },
  } = useKelasForm({ kelas });

  const isEditMode = Boolean(kelas);

  useEffect(() => {
    if (open) {
      reset({
        nama: kelas?.nama ?? "",
        kode: kelas?.kode ?? "",
        angkatan: kelas?.angkatan ?? new Date().getFullYear(),
      });
    }
  }, [open, kelas, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync(data);
      onOpenChange(false);
    } catch {
      // Error dihandle otomatis oleh useMutation
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <DialogContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Kelas" : "Tambah Kelas"}</DialogTitle>
              <DialogDescription>{isEditMode ? "Ubah data kelas yang sudah terdaftar" : "Daftarkan kelas baru ke sistem"}</DialogDescription>
            </DialogHeader>

            <Controller
              name="nama"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="nama">
                    Nama Kelas <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id="nama"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan nama kelas disini..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="angkatan"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="angkatan">
                    Tahun Angkatan <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    id="angkatan"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan tahun angkatan disini..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="kode"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="kode">
                    Kode Kelas <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id="kode"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan kode kelas disini..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Batalkan
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Memproses" : isEditMode ? "Simpan Perubahan" : "Tambah Kelas"}
                {isPending && <Spinner data-icon="inline-start" />}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
