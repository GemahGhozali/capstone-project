"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useBagianForm } from "../hooks";
import { BagianKuesioner } from "../types";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

interface BagianFormDialogProps {
  kuesionerId: string;
  bagian?: BagianKuesioner;
  open: boolean;
  closeDialog: () => void;
}

export function BagianFormDialog({ kuesionerId, bagian, open, closeDialog }: BagianFormDialogProps) {
  const {
    form: { control, handleSubmit, reset },
    mutation: { mutateAsync, isPending },
  } = useBagianForm({ kuesionerId, bagian });

  const isEditMode = Boolean(bagian);

  useEffect(() => {
    if (open) {
      reset({ judul: bagian?.judul ?? "" });
    }
  }, [open, bagian, reset]);

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
      <DialogContent showCloseButton={false}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FieldGroup>
            <Controller
              name="judul"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="judul-bagian">
                    Judul Bagian <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id="judul-bagian"
                    autoComplete="off"
                    disabled={isPending}
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan judul bagian disini..."
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
              {isPending ? "Memproses" : isEditMode ? "Simpan Perubahan" : "Tambah Bagian"}
              {isPending && <Spinner data-icon="inline-start" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
