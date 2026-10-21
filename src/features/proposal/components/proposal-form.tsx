"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Controller } from "react-hook-form";
import { FileUploader } from "@/components/ui/file-uploader";
import { formatFileSize } from "@/utils/format-file-size";
import { useProposalForm } from "../hooks";
import { ProposalManagementData } from "../types";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProposalFormProps {
  proposal: ProposalManagementData;
}

export function ProposalForm({ proposal }: ProposalFormProps) {
  const {
    form: { control, handleSubmit },
    mutation: { mutate, isPending },
  } = useProposalForm({ proposal });

  const onSubmit = handleSubmit((data) => mutate(data));

  const isEditMode = Boolean(proposal);

  return (
    <Card className="p-0 gap-0 divide-y">
      <CardHeader className="p-6">
        <CardTitle>{isEditMode ? "Edit Proposal" : "Upload Proposal"}</CardTitle>
        <CardDescription>{isEditMode ? "Perbaharui" : "Lengkapi"} judul, informasi mitra, dan berkas proposal tim Anda.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={onSubmit}>
          <FieldGroup>
            {/* Judul Proposal */}
            <Controller
              name="judul"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="judul">
                    Judul Proposal <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id="judul"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan Judul Proposal disini..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Mitra */}
            <Controller
              name="mitra"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="mitra">
                    Nama Mitra <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id="mitra"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan Nama Mitra disini..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* File */}
            <Controller
              name="file"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    File Proposal <span className="text-red-600">*</span>
                  </FieldLabel>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  <FileUploader
                    label="Pilih atau Drag & Drop File Disini"
                    description={proposal && field.value ? formatFileSize(proposal.fileSize) : "Format file PDF, maksimal 5 MB"}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={isPending}
                    accept="application/pdf"
                    invalid={fieldState.invalid}
                  />
                </Field>
              )}
            />

            {/* Submit Button */}
            <Field orientation="horizontal" className="justify-end">
              <Button type="submit" disabled={isPending} className="max-sm:w-full">
                {isPending ? "Memproses" : isEditMode ? "Update Proposal Tim" : "Submit Proposal Tim"}
                {isPending && <Spinner data-icon="inline-start" />}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
