"use client";

import { cn } from "cn";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { TipePertanyaan } from "@/generated/prisma/enums";
import { usePertanyaanForm } from "../hooks";
import { PertanyaanKuesioner } from "../types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IconAlignCenter, IconTopologyBus } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";

const questionTypeDescriptions: Record<TipePertanyaan, string> = {
  Likert: "Jawaban berupa skala likert 1 - 5",
  Esai: "Jawaban berupa teks bebas",
};

const questionTypeRadioOptions = Object.values(TipePertanyaan).map((type) => ({
  value: type,
  label: type === "Esai" ? "Teks Esai" : "Skala Likert",
  icon: type === "Esai" ? <IconAlignCenter size={20} /> : <IconTopologyBus size={20} stroke={1.5} className="rotate-180" />,
}));

interface PertanyaanKuesionerFormDialogProps {
  bagianId: string;
  pertanyaan?: PertanyaanKuesioner;
  open: boolean;
  closeDialog: () => void;
}

export function PertanyaanKuesionerFormDialog({ bagianId, pertanyaan, open, closeDialog }: PertanyaanKuesionerFormDialogProps) {
  const {
    form: { control, handleSubmit, reset },
    mutation: { mutateAsync, isPending },
  } = usePertanyaanForm({ bagianId, pertanyaan });

  const isEditMode = Boolean(pertanyaan);

  useEffect(() => {
    if (open) {
      reset({
        teks: pertanyaan?.teks ?? "",
        tipe: pertanyaan?.tipe ?? "Likert",
        wajib: pertanyaan?.wajib ?? true,
      });
    }
  }, [open, pertanyaan, reset]);

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
              name="teks"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="teks-pertanyaan">
                    Teks Pertanyaan <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="teks-pertanyaan"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan teks pertanyaan disini..."
                    rows={3}
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="tipe"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Tipe Pertanyaan <span className="text-red-600">*</span>
                  </FieldLabel>
                  <FieldDescription>{questionTypeDescriptions[field.value]}</FieldDescription>
                  <RadioGroup
                    name={field.name}
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                    className="grid-cols-1 sm:grid-cols-2"
                  >
                    {questionTypeRadioOptions.map((option) => (
                      <Label
                        key={option.value}
                        className={cn(
                          "flex items-center justify-center gap-1.5 h-11 cursor-pointer rounded-md border bg-transparent px-3 text-sm font-medium transition-colors",
                          field.value === option.value
                            ? "border-sidebar-primary bg-sidebar-primary/10 text-sidebar-primary"
                            : "border-input text-muted-foreground hover:bg-muted/50",
                        )}
                      >
                        <RadioGroupItem value={option.value} className="sr-only size-0" />
                        {option.icon}
                        {option.label}
                      </Label>
                    ))}
                  </RadioGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="wajib"
              control={control}
              render={({ field }) => (
                <FieldLabel htmlFor="wajib-pertanyaan">
                  <Field orientation="horizontal">
                    <Checkbox
                      id="wajib-pertanyaan"
                      disabled={isPending}
                      checked={field.value ?? true}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                    <FieldContent>
                      <FieldTitle>Wajib Diisi</FieldTitle>
                      <FieldDescription>Mahasiswa diwajibkan menjawab pertanyaan ini</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog} disabled={isPending}>
              Batalkan
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Memproses" : isEditMode ? "Simpan Perubahan" : "Tambah Pertanyaan"}
              {isPending && <Spinner data-icon="inline-start" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
