"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { AuthenticatedUserData } from "@/features/auth/types";
import { useUpdateUserAccountForm } from "@/features/auth/hooks";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AvatarUploader, AvatarUploaderPreview, AvatarUploaderRemover, AvatarUploaderTrigger } from "../ui/avatar-uploader";

interface UserProfileSheetProps {
  user: AuthenticatedUserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileSheet({ user, open, onOpenChange }: UserProfileSheetProps) {
  const {
    mutation: { mutate, isPending },
    form: { control, handleSubmit, reset },
  } = useUpdateUserAccountForm(user);

  const onSubmit = handleSubmit((data) => mutate(data, { onSuccess: () => onOpenChange(false) }));

  useEffect(() => {
    if (!open) return;

    reset({
      fotoProfil: user.fotoProfil,
      namaLengkap: user.namaLengkap,
      alamatEmail: user.alamatEmail,
      password: "",
    });
  }, [open, user, reset]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" showCloseButton={false} className="data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <form onSubmit={onSubmit} className="flex h-full min-h-0 flex-col divide-y">
          <SheetHeader className="p-6">
            <SheetTitle className="text-base">Pengaturan Profil</SheetTitle>
            <SheetDescription>Perbarui foto profil, nama, email, dan password akun anda.</SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            <FieldGroup className="gap-6">
              <Controller
                name="fotoProfil"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
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
                    <FieldLabel htmlFor="password">Password Baru (Opsional)</FieldLabel>
                    <FieldDescription>Password lama akan diganti dengan password baru</FieldDescription>
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
            </FieldGroup>
          </div>
          <SheetFooter className="p-6 gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan" : "Simpan Profil"}
              {isPending && <Spinner data-icon="inline-start" />}
            </Button>
            <SheetClose
              render={
                <Button type="button" variant="outline" disabled={isPending}>
                  Tutup
                </Button>
              }
            />
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
