"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { NilaiMahasiswa } from "../types";
import { usePenilaianForm } from "../hooks";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PenilaianFormDialogProps {
  mahasiswa?: NilaiMahasiswa;
  open: boolean;
  closeDialog: () => void;
}

export function PenilaianFormDialog({ mahasiswa, open, closeDialog }: PenilaianFormDialogProps) {
  const {
    form: { control, handleSubmit, reset },
    mutation: { mutate, isPending },
  } = usePenilaianForm({ mahasiswa });

  useEffect(() => {
    if (open && mahasiswa) {
      reset({ mahasiswaId: mahasiswa.id, nilai: mahasiswa.nilai ?? 0 });
    }
  }, [mahasiswa, open, reset]);

  const onSubmit = handleSubmit((data) => mutate(data, { onSuccess: closeDialog }));

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          closeDialog();
        }
      }}
    >
      {open && mahasiswa && (
        <DialogContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <DialogHeader>
              <DialogTitle>{mahasiswa.nilai === null ? "Beri Nilai Capstone" : "Ubah Nilai Capstone"}</DialogTitle>
              <DialogDescription>
                Nilai untuk {mahasiswa.namaLengkap} ({mahasiswa.nim}) berupa angka range 0 - 100
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Controller
                name="nilai"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="nilai">
                      Nilai <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      min={0}
                      max={100}
                      id="nilai"
                      type="number"
                      aria-invalid={fieldState.invalid}
                      placeholder="Masukkan nilai mahasiswa disini..."
                      autoComplete="off"
                      disabled={isPending}
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
                {isPending ? "Menyimpan" : "Simpan Nilai"}
                {isPending && <Spinner data-icon="inline-start" />}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
