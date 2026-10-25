"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Controller } from "react-hook-form";
import { FileUploader } from "@/components/ui/file-uploader";
import { formatFileSize } from "@/utils/format-file-size";
import { useResumeForm } from "../hooks";
import { ResumeManagementData } from "../types";
import { getAllDosenPembimbing } from "@/features/dosen/queries";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResumeFormProps {
  resume: ResumeManagementData;
  dosenPembimbingList: Awaited<ReturnType<typeof getAllDosenPembimbing>>;
}

export function ResumeForm({ resume, dosenPembimbingList }: ResumeFormProps) {
  const {
    form: { control, handleSubmit },
    mutation: { mutate, isPending },
  } = useResumeForm({ resume });

  const onSubmit = handleSubmit((data) => mutate(data));

  const isEditMode = Boolean(resume);

  return (
    <Card className="p-0 gap-0 divide-y">
      <CardHeader className="p-6">
        <CardTitle>{isEditMode ? "Edit Resume" : "Upload Resume"}</CardTitle>
        <CardDescription>{isEditMode ? "Perbaharui" : "Lengkapi"} subjudul, berkas resume dan tentukan dosen pembimbing Anda.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={onSubmit}>
          <FieldGroup>
            {/* Subjudul */}
            <Controller
              name="subjudul"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="subjudul">
                    Subjudul Proposal <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id="subjudul"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan Subjudul Proposal disini..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Dosen Pembimbing */}
            <Controller
              control={control}
              name="dosenId"
              render={({ field, fieldState }) => {
                const selectedDosenPembimbing = dosenPembimbingList.find((dosen) => dosen.id === field.value);
                const isDisabled = isPending || dosenPembimbingList.length === 0;

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="dosenId">
                      Dosen Pembimbing <span className="text-red-600">*</span>
                    </FieldLabel>
                    {resume && resume.dosen.id !== field.value && (
                      <FieldDescription>
                        Kembali ke pilihan Dosen Pembimbing awal :{" "}
                        <span onClick={() => field.onChange(resume.dosen.id)} className="underline cursor-pointer">
                          {resume.dosen.namaLengkap}
                        </span>
                      </FieldDescription>
                    )}
                    <Select
                      disabled={isDisabled}
                      value={field.value}
                      onValueChange={field.onChange}
                      onOpenChange={(open) => {
                        if (!open) {
                          field.onBlur();
                        }
                      }}
                    >
                      <SelectTrigger id="dosenId" aria-invalid={fieldState.invalid} disabled={isDisabled}>
                        <SelectValue
                          placeholder={
                            dosenPembimbingList.length === 0 ? "Tidak ada data dosen pembimbing" : "Silahkan pilih dosen pembimbing disini..."
                          }
                        >
                          {selectedDosenPembimbing?.namaLengkap}
                        </SelectValue>
                      </SelectTrigger>
                      {dosenPembimbingList.length > 0 && (
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Pilihan Dosen Pembimbing</SelectLabel>
                            {dosenPembimbingList.map((dosenPembimbing) => (
                              <SelectItem
                                key={dosenPembimbing.id}
                                value={dosenPembimbing.id}
                                disabled={dosenPembimbing.isFull}
                                className="py-2 [&>div:first-child]:min-w-0 [&>div:first-child]:shrink"
                              >
                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <p className="font-medium truncate">{dosenPembimbing.namaLengkap}</p>
                                  <p className="text-muted-foreground text-xs">
                                    Kuota Bimbingan : {dosenPembimbing.totalBimbingan}/{dosenPembimbing.batasBimbingan}
                                  </p>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      )}
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                );
              }}
            />

            {/* File */}
            <Controller
              name="file"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    File Resume <span className="text-red-600">*</span>
                  </FieldLabel>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  <FileUploader
                    label="Pilih atau Drag & Drop File Disini"
                    description={resume && field.value ? formatFileSize(resume.fileSize) : "Format file PDF, maksimal 5 MB"}
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
                {isPending ? "Memproses" : isEditMode ? "Update Resume" : "Submit Resume"}
                {isPending && <Spinner data-icon="inline-start" />}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
