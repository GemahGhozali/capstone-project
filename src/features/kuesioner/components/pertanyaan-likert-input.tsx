"use client";

import { Label } from "@/components/ui/label";
import { LIKERT_OPTIONS } from "../utils";
import { Field, FieldError } from "@/components/ui/field";
import { PertanyaanKuesionerWizard } from "../types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";

interface PertanyaanLikertProps {
  urutan: number;
  pertanyaan: PertanyaanKuesionerWizard;
  field: ControllerRenderProps<Record<string, string>>;
  fieldState: ControllerFieldState;
  disabled: boolean;
}

export function PertanyaanLikert({ urutan, pertanyaan, field, fieldState, disabled }: PertanyaanLikertProps) {
  return (
    <Field
      data-invalid={fieldState.invalid}
      className="p-6 grid gap-6 sm:gap-4 grid-cols-1 lg:grid-cols-[30px_4fr_7fr] items-center data-[invalid=true]:ring-inset data-[invalid=true]:ring data-[invalid=true]:ring-destructive"
    >
      <p className="max-lg:hidden text-center text-foreground">{urutan}.</p>
      <div className="flex flex-col gap-1.5">
        <p className="max-lg:order-2 text-foreground">
          {pertanyaan.teks}
          {pertanyaan.wajib && <span className="text-red-600 ml-1">*</span>}
        </p>
        {fieldState.invalid && <FieldError className="max-lg:order-1" errors={[fieldState.error]} />}
      </div>
      <RadioGroup
        className="grid grid-cols-1 sm:grid-cols-5 text-center max-sm:gap-4"
        value={field.value ?? ""}
        onValueChange={(value) => field.onChange(value)}
        onBlur={field.onBlur}
        disabled={disabled}
        aria-invalid={fieldState.invalid}
      >
        {LIKERT_OPTIONS.map((option) => (
          <div key={option.value} className="flex sm:flex-col gap-1.5 items-center">
            <RadioGroupItem id={`pertanyaan-${pertanyaan.id}-${option.value}`} value={String(option.value)} className="size-4 border-ring" />
            <Label htmlFor={`pertanyaan-${pertanyaan.id}-${option.value}`} className="text-xs text-muted-foreground lg:hidden">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </Field>
  );
}
