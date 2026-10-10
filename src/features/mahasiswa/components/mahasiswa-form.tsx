"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { DatePicker } from "@/components/ui/date-picker";
import { getAllKelas } from "@/features/kelas/queries";
import { useMahasiswaForm } from "../hooks";
import { getMahasiswaById } from "../queries";
import { Controller, useWatch } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { AvatarUploader, AvatarUploaderPreview, AvatarUploaderRemover, AvatarUploaderTrigger } from "@/components/ui/avatar-uploader";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MahasiswaFormProps {
  mahasiswa?: Awaited<ReturnType<typeof getMahasiswaById>>;
  kelas: Awaited<ReturnType<typeof getAllKelas>>;
}

export function MahasiswaForm({ mahasiswa, kelas }: MahasiswaFormProps) {
  const {
    mutation: { mutate, isPending },
    form: { control, handleSubmit, getValues, setValues },
  } = useMahasiswaForm({ mahasiswa });

  const onSubmit = handleSubmit((data) => mutate(data));

  const router = useRouter();

  // Flag untuk mengetahui apakah sedang dalam mode edit
  const isEditMode = Boolean(mahasiswa);

  // State value dari NIM mahasiswa
  const nimValue = useWatch({ control, name: "nim" });

  const handleSetDefaultAccount = () => {
    const nimValue = getValues("nim");
    if (!nimValue) return;
    setValues({ alamatEmail: `${nimValue}@gmail.com`, password: nimValue }, { shouldValidate: true });
  };

  return (
    <Card>
      <form onSubmit={onSubmit} className="space-y-6 *:px-6">
        <FieldSet>
          <FieldLegend className="text-lg! flex gap-3">
            <div className="bg-primary/10 text-primary text-xs size-7 grid place-content-center rounded-full">01</div>
            Informasi Umum
          </FieldLegend>
          <FieldDescription>Silahkan isi biodata diri dari mahasiswa</FieldDescription>
          <FieldGroup className="grid lg:grid-cols-2">
            {/* Foto Profil */}
            <Controller
              name="fotoProfil"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="lg:col-span-2">
                  <AvatarUploader
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    disabled={isPending}
                    render={() => (
                      <div className="flex max-sm:flex-col max-sm:items-center gap-3">
                        <AvatarUploaderPreview className="rounded-full" />
                        <div className="flex flex-col gap-2 max-sm:items-center max-sm:*:text-center">
                          <FieldLabel>Foto Profil (Opsional)</FieldLabel>
                          {fieldState.invalid ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : (
                            <FieldDescription>JPEG, JPG, PNG and WEBP, Maks. 1 MB</FieldDescription>
                          )}
                          <div className="flex items-center gap-2">
                            <AvatarUploaderTrigger size="sm" variant="outline" className="text-foreground!">
                              {field.value ? "Ganti" : "Upload"}
                            </AvatarUploaderTrigger>
                            <AvatarUploaderRemover size="sm" variant="destructive">
                              Hapus
                            </AvatarUploaderRemover>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </Field>
              )}
            />

            {/* Nama Lengkap */}
            <Controller
              name="namaLengkap"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="lg:col-span-2">
                  <FieldLabel htmlFor="namaLengkap">
                    Nama Lengkap <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id="namaLengkap"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan nama lengkap mahasiswa disini..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* NIM */}
            <Controller
              name="nim"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="nim">
                    NIM <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id="nim"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan NIM mahasiswa disini..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Kelas */}
            <Controller
              control={control}
              name="kelasId"
              render={({ field, fieldState }) => {
                const selectedKelas = kelas.find((kelas) => kelas.id === field.value);
                const isDisabled = isPending || kelas.length === 0;

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="kelasId">
                      Kelas <span className="text-red-600">*</span>
                    </FieldLabel>
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
                      <SelectTrigger id="kelasId" aria-invalid={fieldState.invalid} disabled={isDisabled}>
                        <SelectValue placeholder={kelas.length === 0 ? "Tidak ada data kelas" : "Silahkan pilih kelas mahasiswa disini..."}>
                          {selectedKelas?.nama}
                        </SelectValue>
                      </SelectTrigger>
                      {kelas.length > 0 && (
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Pilihan Kelas</SelectLabel>
                            {kelas.map((kelas) => (
                              <SelectItem key={kelas.id} value={kelas.id}>
                                <div>
                                  <p className="font-medium">{kelas.nama}</p>
                                  <p className="text-muted-foreground text-xs">Tahun Angkatan {kelas.angkatan}</p>
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

            {/* Tanggal Masuk */}
            <Controller
              control={control}
              name="tanggalMasuk"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="tanggalMasuk">
                    Tanggal Masuk <span className="text-red-600">*</span>
                  </FieldLabel>
                  <DatePicker
                    id="tanggalMasuk"
                    placeholder="Pilih tanggal masuk disini..."
                    disabled={isPending}
                    invalid={fieldState.invalid}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Status Keaktifan Mahasiswa */}
            <Controller
              control={control}
              name="status"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="status">
                    Status Keaktifan <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Select
                    disabled={isPending}
                    value={field.value}
                    onValueChange={field.onChange}
                    onOpenChange={(open) => {
                      if (!open) {
                        field.onBlur();
                      }
                    }}
                  >
                    <SelectTrigger id="status" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Pilih status keaktifan mahasiswa disini..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status Keaktifan</SelectLabel>
                        {["Aktif", "Nonaktif", "Arsip"].map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <Separator />

        <FieldSet>
          <div className="flex flex-col lg:flex-row gap-3 justify-between items-start">
            <div>
              <FieldLegend className="text-lg! flex gap-3">
                <div className="bg-primary/10 text-primary text-xs size-7 grid place-content-center rounded-full">02</div>
                Informasi Akun
              </FieldLegend>
              <FieldDescription>Tentukan email dan password default untuk akun mahasiswa</FieldDescription>
            </div>
            <Button onClick={handleSetDefaultAccount} disabled={!nimValue}>
              Samakan Akun Dengan NIM
            </Button>
          </div>
          <FieldGroup>
            {/* Alamat Email */}
            <Controller
              name="alamatEmail"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="alamatEmail">
                    Alamat Email <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    id="alamatEmail"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan alamat email mahasiswa disini..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">
                    {isEditMode ? "Password Baru (Opsional)" : "Password"}
                    {!isEditMode && <span className="text-red-600">*</span>}
                  </FieldLabel>
                  {isEditMode && <FieldDescription>Password lama akan diganti dengan password baru</FieldDescription>}
                  <Input
                    {...field}
                    type="text"
                    id="password"
                    aria-invalid={fieldState.invalid}
                    placeholder={isEditMode ? "Masukkan password baru disini..." : "Masukkan password disini..."}
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>

        {/* Submit Button */}
        <FieldGroup className="pt-6">
          <Field orientation="horizontal" className="items-stretch flex-col sm:flex-row sm:justify-end">
            <Button type="submit" size="lg" disabled={isPending} className="sm:order-2">
              {isPending ? "Memproses" : isEditMode ? "Update Data Mahasiswa" : "Tambah Data Mahasiswa"}
              {isPending && <Spinner data-icon="inline-start" />}
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.back()} disabled={isPending} className="sm:order-1">
              Batalkan
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </Card>
  );
}
