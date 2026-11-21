"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Controller } from "react-hook-form";
import { FileUploader } from "@/components/ui/file-uploader";
import { ImportMahasiswaGuide } from "./import-mahasiswa-guide";
import { useImportMahasiswaForm } from "../hooks";
import { IconAlertTriangle, IconX } from "@tabler/icons-react";
import { Closable, ClosableTrigger } from "@/components/ui/closable";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ImportMahasiswaForm() {
  const {
    form: { handleSubmit, control },
    mutation: { mutate, isPending, error },
  } = useImportMahasiswaForm();

  const onSubmit = handleSubmit((data) => mutate(data));

  const rowErrors = error?.data?.errors ?? [];

  return (
    <div className="space-y-6">
      <ImportMahasiswaGuide />
      <Card>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Controller
                name="defaultPassword"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">
                      Default Password <span className="text-red-600">*</span>
                    </FieldLabel>
                    <FieldDescription>Semua mahasiswa akan memiliki default password yang sama</FieldDescription>
                    <Input
                      {...field}
                      type="text"
                      id="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Masukkan password baru disini..."
                      autoComplete="off"
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
                    <FieldLabel htmlFor="password">
                      File Excel <span className="text-red-600">*</span>
                    </FieldLabel>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : (
                      <FieldDescription>Pastikan semua data mahasiswa sudah sesuai dengan ketentuan yang ada</FieldDescription>
                    )}
                    <FileUploader
                      label="Pilih atau Drag & Drop File Disini"
                      disabled={isPending}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      invalid={fieldState.invalid}
                      accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      description="Format file XLSX, maksimal 5 MB dan 500 baris data"
                    />
                  </Field>
                )}
              />
              {error && (
                <Closable>
                  <Alert variant="destructive" className="border-none bg-destructive/10 pr-4! mt-5">
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
                  {isPending ? "Memproses" : "Import Mahasiswa"}
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
            <CardDescription>Silahkan perbaiki data pada baris berikut lalu upload ulang.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="*:py-4 *:px-6">
                  <TableHead className="w-24">Baris</TableHead>
                  <TableHead>Kolom</TableHead>
                  <TableHead className="">Pesan Kesalahan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rowErrors.map((error, index) => (
                  <TableRow key={`${error.row}-${error.field}-${index}`} className="*:py-4 *:px-6">
                    <TableCell className="">{error.row}</TableCell>
                    <TableCell className="capitalize">{error.field}</TableCell>
                    <TableCell className="">{error.message}</TableCell>
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
