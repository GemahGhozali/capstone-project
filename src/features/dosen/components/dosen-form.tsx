"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { getAllProdi } from "@/features/prodi/queries";
import { useDosenForm } from "../hooks";
import { Controller, useWatch } from "react-hook-form";
import { getAllDosenRoles, getDosenById } from "../queries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { AvatarUploader, AvatarUploaderPreview, AvatarUploaderRemover, AvatarUploaderTrigger } from "@/components/ui/avatar-uploader";

interface DosenFormProps {
  dosen?: Awaited<ReturnType<typeof getDosenById>>;
  prodi: Awaited<ReturnType<typeof getAllProdi>>;
  role: Awaited<ReturnType<typeof getAllDosenRoles>>;
}

export function DosenForm({ dosen, prodi, role }: DosenFormProps) {
  const {
    mutation: { mutate, isPending },
    form: { control, handleSubmit, getValues, setValues },
  } = useDosenForm({ dosen });

  const onSubmit = handleSubmit((data) => mutate(data));

  const router = useRouter();

  // Flag untuk mengetahui apakah role "Dosen Pembimbing" terpilih
  const selectedRoles = useWatch({ control, name: "roleId" });
  const dosenPembimbingRoleId = role.find((role) => role.nama === "Dosen Pembimbing")?.id;
  const isDosenPembimbingRoleSelected = dosenPembimbingRoleId ? selectedRoles.includes(dosenPembimbingRoleId) : false;

  // Flag untuk mengetahui apakah sedang dalam mode edit
  const isEditMode = Boolean(dosen);

  // State value dari NIP dosen
  const nipValue = useWatch({ control, name: "nip" });

  const handleSetDefaultAccount = () => {
    const nipValue = getValues("nip");
    if (!nipValue) return;
    setValues({ alamatEmail: `${nipValue}@gmail.com`, password: nipValue });
  };

  return (
    <Card>
      <form onSubmit={onSubmit} className="space-y-6 *:px-6">
        <FieldSet>
          <FieldLegend className="text-lg! flex gap-3">
            <div className="bg-primary/10 text-primary text-xs size-7 grid place-content-center rounded-full">01</div>
            Informasi Umum
          </FieldLegend>
          <FieldDescription>Silahkan isi biodata diri dari dosen</FieldDescription>
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
                    placeholder="Masukkan nama lengkap dosen disini..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* NIP Dosen */}
            <Controller
              name="nip"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="nip">
                    NIP <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id="nip"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan NIP dosen disini..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Bidang Keahlian */}
            <Controller
              name="bidangKeahlian"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="bidangKeahlian">
                    Bidang Keahlian <span className="text-red-600">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    id="bidangKeahlian"
                    aria-invalid={fieldState.invalid}
                    placeholder="Masukkan bidang keahlian dosen disini..."
                    autoComplete="off"
                    disabled={isPending}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* Program Studi */}
            <Controller
              control={control}
              name="prodiId"
              render={({ field, fieldState }) => {
                const selectedProdi = prodi.find((prodi) => prodi.id === field.value);
                const isDisabled = isPending || prodi.length === 0;

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="prodiId">
                      Program Studi <span className="text-red-600">*</span>
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
                      <SelectTrigger id="prodiId" aria-invalid={fieldState.invalid} disabled={isDisabled}>
                        <SelectValue placeholder={prodi.length === 0 ? "Tidak ada data prodi" : "Silahkan pilih prodi dosen disini..."}>
                          {selectedProdi?.nama}
                        </SelectValue>
                      </SelectTrigger>

                      {prodi.length > 0 && (
                        <SelectContent>
                          {prodi.map((prodi) => (
                            <SelectItem key={prodi.id} value={prodi.id}>
                              {prodi.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      )}
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                );
              }}
            />

            {/* Status Keaktifan Dosen */}
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
                      <SelectValue placeholder="Pilih status keaktifan dosen disini..." />
                    </SelectTrigger>
                    <SelectContent>
                      {["Aktif", "Nonaktif", "Pindah"].map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
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
              <FieldDescription>Tentukan email dan password default untuk akun dosen</FieldDescription>
            </div>
            <Button onClick={handleSetDefaultAccount} disabled={!nipValue}>
              Samakan Akun Dengan NIP
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
                    placeholder="Masukkan alamat email dosen disini..."
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

            {/* Role */}
            <Controller
              name="roleId"
              control={control}
              render={({ field, fieldState }) => (
                <FieldGroup>
                  <FieldSet data-invalid={fieldState.invalid}>
                    <FieldLegend variant="label">
                      Role <span className="text-red-600">*</span>
                    </FieldLegend>
                    <FieldGroup data-slot="checkbox-group" className="grid grid-cols-1 gap-4! lg:grid-cols-3">
                      {role.map((role) => (
                        <FieldLabel key={role.id}>
                          <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                            <Checkbox
                              id={role.nama}
                              name={field.name}
                              disabled={isPending}
                              aria-invalid={fieldState.invalid}
                              checked={field.value.includes(role.id)}
                              onCheckedChange={(checked) => {
                                const newValue = checked ? [...field.value, role.id] : field.value.filter((value) => value !== role.id);
                                field.onChange(newValue);
                              }}
                            />
                            <FieldContent>
                              <FieldTitle>{role.nama}</FieldTitle>
                            </FieldContent>
                          </Field>
                        </FieldLabel>
                      ))}
                    </FieldGroup>
                  </FieldSet>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldGroup>
              )}
            />
          </FieldGroup>
        </FieldSet>

        {isDosenPembimbingRoleSelected && (
          <>
            <Separator />
            <FieldSet>
              <FieldLegend className="text-lg! flex gap-3">
                <div className="bg-primary/10 text-primary text-xs size-7 grid place-content-center rounded-full">03</div>
                Informasi Bimbingan
              </FieldLegend>
              <FieldDescription>Tentukan status serta kuota maksimal bimbingan untuk dosen</FieldDescription>
              <FieldGroup>
                {/* Status Keaktifan Bimbingan */}
                <Controller
                  control={control}
                  name="statusBimbingan"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="statusBimbingan">
                        Status Bimbingan <span className="text-red-600">*</span>
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
                        <SelectTrigger id="statusBimbingan" aria-invalid={fieldState.invalid}>
                          <SelectValue placeholder="Pilih status bimbingan dosen disini..." />
                        </SelectTrigger>
                        <SelectContent>
                          {["Buka", "Tutup"].map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Kuota Bimbingan */}
                <Controller
                  name="kuotaBimbingan"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="kuotaBimbingan">
                        Kuota Bimbingan <span className="text-red-600">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="kuotaBimbingan"
                        type="number"
                        aria-invalid={fieldState.invalid}
                        placeholder="Masukkan kuota bimbingan disini..."
                        autoComplete="off"
                        disabled={isPending}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
          </>
        )}

        {/* Submit Button */}
        <FieldGroup className="pt-6">
          <Field orientation="horizontal" className="items-stretch flex-col sm:flex-row sm:justify-end">
            <Button type="submit" size="lg" disabled={isPending} className="sm:order-2">
              {isPending ? "Memproses" : isEditMode ? "Update Data Dosen" : "Tambah Data Dosen"}
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
