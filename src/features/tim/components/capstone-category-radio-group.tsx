"use client";

import { TeamInput } from "../schemas";
import { Controller, useFormContext } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldContent, FieldError, FieldLabel, FieldTitle } from "@/components/ui/field";

interface CapstoneCategoryRadioGroupProps {
  memberIndex: number;
}

export function CapstoneCategoryRadioGroup({ memberIndex }: CapstoneCategoryRadioGroupProps) {
  const { control } = useFormContext<TeamInput>();

  return (
    <Controller
      name={`anggota.${memberIndex}.kategoriCapstone`}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <RadioGroup name={field.name} value={field.value} onValueChange={field.onChange} aria-invalid={fieldState.invalid} className="grid-cols-2">
            <FieldLabel>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle className="lg:hidden">EPD</FieldTitle>
                  <FieldTitle className="max-lg:hidden">Engineering Process Design (EPD)</FieldTitle>
                </FieldContent>
                <RadioGroupItem value="EPD" />
              </Field>
            </FieldLabel>
            <FieldLabel>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle className="lg:hidden">SM</FieldTitle>
                  <FieldTitle className="max-lg:hidden">Scientific Method (SM)</FieldTitle>
                </FieldContent>
                <RadioGroupItem value="SM" />
              </Field>
            </FieldLabel>
          </RadioGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
