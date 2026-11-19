"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Controller } from "react-hook-form";
import { FileUploader } from "@/components/ui/file-uploader";
import { formatFileSize } from "@/utils/format-file-size";
import { useBimbinganForm } from "../hooks";
import { BimbinganMahasiswa } from "../types";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface BimbinganFormSheetProps {
  open: boolean;
  bimbingan?: BimbinganMahasiswa;
  closeDialog: () => void;
}

export function BimbinganFormSheet({ bimbingan, open, closeDialog }: BimbinganFormSheetProps) {
  const isEditMode = Boolean(bimbingan);

  const {
    form: { control, handleSubmit, reset },
    mutation: { mutate, isPending },
  } = useBimbinganForm({ bimbingan });

  useEffect(() => {
    if (open) {
      reset({
        catatan: bimbingan?.catatan ?? "",
        file: bimbingan?.fileName ?? undefined,
        tanggal: bimbingan ? new Date(bimbingan.tanggal) : new Date(),
      });
    }
  }, [open, bimbingan, reset]);

  const onSubmit = handleSubmit((data) => mutate(data, { onSuccess: closeDialog, onError: closeDialog }));

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          closeDialog();
        }
      }}
    >
      <SheetContent side="right" showCloseButton={false} className="data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <form onSubmit={onSubmit} className="flex h-full min-h-0 flex-col divide-y">
          <SheetHeader className="p-6">
            <SheetTitle className="text-base">{isEditMode ? "Edit Catatan Bimbingan" : "Tambah Catatan Bimbingan"}</SheetTitle>
            <SheetDescription>Lengkapi tanggal, catatan, dan bukti pendukung kegiatan bimbingan anda.</SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            <FieldGroup className="gap-6">
              <Controller
                name="tanggal"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="tanggal">
                      Tanggal Bimbingan <span className="text-red-600">*</span>
                    </FieldLabel>
                    <DatePicker
                      id="tanggal"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={isPending}
                      invalid={fieldState.invalid}
                      placeholder="Pilih tanggal bimbingan disini..."
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="catatan"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="catatan">
                      Catatan Bimbingan <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="catatan"
                      rows={5}
                      placeholder="Tuliskan hasil atau catatan kegiatan bimbingan anda..."
                      aria-invalid={fieldState.invalid}
                      disabled={isPending}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="file"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Bukti Pendukung <span className="text-red-600">*</span>
                    </FieldLabel>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    <FileUploader
                      label="Pilih atau Drag & Drop File Disini"
                      disabled={isPending}
                      invalid={fieldState.invalid}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      accept="application/pdf,image/jpeg,image/png,image/webp"
                      description={bimbingan && field.value ? formatFileSize(bimbingan.fileSize) : "Format PDF, JPG, PNG, atau WebP. Maksimal 5 MB"}
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
          <SheetFooter className="p-6 gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Memproses" : isEditMode ? "Simpan Perubahan" : "Tambah Catatan"}
              {isPending && <Spinner data-icon="inline-start" />}
            </Button>
            <Button type="button" variant="outline" onClick={closeDialog} disabled={isPending}>
              Batalkan
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
