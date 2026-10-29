"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useProdiForm } from "../hooks";
import { ProdiOverview } from "../types";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProdiFormDialogProps {
  prodi?: ProdiOverview;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProdiFormDialog({ prodi, open, onOpenChange }: ProdiFormDialogProps) {
  const {
    form: { control, handleSubmit, reset },
    mutation: { mutateAsync, isPending },
  } = useProdiForm({ prodi });

  const isEditMode = Boolean(prodi);

  useEffect(() => {
    if (open) {
      reset({ nama: prodi?.nama ?? "" });
    }
  }, [open, prodi, reset]);

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync(data);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <DialogContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Prodi" : "Tambah Prodi"}</DialogTitle>
              <DialogDescription>{isEditMode ? "Ubah data prodi yang sudah terdaftar" : "Daftarkan prodi baru ke sistem"}</DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Controller
                name="nama"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="nama">
                      Nama Prodi <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input {...field} type="text" id="nama" aria-invalid={fieldState.invalid} placeholder="Masukkan nama prodi disini..." autoComplete="off" disabled={isPending} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Batalkan
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Memproses" : isEditMode ? "Simpan Perubahan" : "Tambah Prodi"}
                {isPending && <Spinner data-icon="inline-start" />}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
