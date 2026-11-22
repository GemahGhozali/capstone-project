"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Controller } from "react-hook-form";
import { FileUploader } from "@/components/ui/file-uploader";
import { ImportPenilaianGuide } from "./import-penilaian-guide";
import { useImportPenilaianForm } from "../hooks";
import { IconAlertTriangle, IconX } from "@tabler/icons-react";
import { Closable, ClosableTrigger } from "@/components/ui/closable";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ImportPenilaianForm() {
  const {
    form: { handleSubmit, control },
    mutation: { mutate, isPending, error },
  } = useImportPenilaianForm();

  const onSubmit = handleSubmit((data) => mutate(data));
  const rowErrors = error?.data?.errors ?? [];

  return (
    <div className="space-y-6">
      <ImportPenilaianGuide />
      <Card>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Controller
                name="file"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="file">
                      File Excel <span className="text-red-600">*</span>
                    </FieldLabel>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : (
                      <FieldDescription>Pilih template yang sudah diisi pada bagian kolom Nilai</FieldDescription>
                    )}
                    <FileUploader
                      label="Pilih atau Drag & Drop File di Sini"
                      disabled={isPending}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      invalid={fieldState.invalid}
                      accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      description="Format XLSX, maksimal 5 MB dan 500 baris data"
                    />
                  </Field>
                )}
              />
              {error && (
                <Closable>
                  <Alert variant="destructive" className="border-none bg-destructive/10 pr-4!">
                    <AlertTitle className="flex items-center gap-1.5 mb-1">
                      <IconAlertTriangle className="size-4" />
                      Import Gagal!
                    </AlertTitle>
                    <AlertDescription className="text-wrap">{error.message}</AlertDescription>
                    <AlertAction className="cursor-pointer">
                      <ClosableTrigger>
                        <Button size="icon-xs" variant="destructive" className="bg-transparent">
                          <IconX className="size-4" />
                        </Button>
                      </ClosableTrigger>
                    </AlertAction>
                  </Alert>
                </Closable>
              )}
              <Field orientation="horizontal" className="justify-end">
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Memproses" : "Import Nilai"}
                  {isPending && <Spinner data-icon="inline-start" />}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      {rowErrors.length > 0 && (
        <Card className="p-0 gap-0 divide-y border-destructive/40">
          <CardHeader className="p-6">
            <CardTitle>Daftar Kesalahan Data</CardTitle>
            <CardDescription>Perbaiki data pada baris berikut, lalu unggah ulang file.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="*:py-4 *:px-6">
                  <TableHead className="w-24">Baris</TableHead>
                  <TableHead>Kolom</TableHead>
                  <TableHead>Pesan Kesalahan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rowErrors.map((rowError, index) => (
                  <TableRow key={`${rowError.row}-${rowError.field}-${index}`} className="*:py-4 *:px-6">
                    <TableCell>{rowError.row}</TableCell>
                    <TableCell className="capitalize">{rowError.field}</TableCell>
                    <TableCell>{rowError.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
