"use client";

import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError } from "@/components/ui/field";
import { PertanyaanKuesionerWizard } from "../types";
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";

interface PertanyaanEsaiProps {
  urutan: number;
  pertanyaan: PertanyaanKuesionerWizard;
  field: ControllerRenderProps<Record<string, string>>;
  fieldState: ControllerFieldState;
  disabled: boolean;
}

export function PertanyaanEsai({ urutan, pertanyaan, field, fieldState, disabled }: PertanyaanEsaiProps) {
  return (
    <Field
      data-invalid={fieldState.invalid}
      className="p-6 grid gap-6 sm:gap-4 grid-cols-1 lg:grid-cols-[30px_4fr_7fr] items-center data-[invalid=true]:ring-inset data-[invalid=true]:ring data-[invalid=true]:ring-destructive"
    >
      <p className="max-lg:hidden text-center text-foreground">{urutan}.</p>
      <div className="flex flex-col gap-1.5">
        <p className="max-lg:order-2 text-foreground">
          {pertanyaan.teks}
          {pertanyaan.wajib && <span className="text-red-600 ml-1.5">*</span>}
        </p>
        {fieldState.invalid && <FieldError className="max-lg:order-1" errors={[fieldState.error]} />}
      </div>
      <Textarea {...field} rows={4} maxLength={1000} placeholder="Tulis jawaban esai disini..." autoComplete="off" disabled={disabled} />
    </Field>
  );
}
