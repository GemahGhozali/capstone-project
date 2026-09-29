"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Controller } from "react-hook-form";
import { useResetPassword } from "../hooks";
import { Closable, ClosableTrigger } from "@/components/ui/closable";
import { PasswordInput, PasswordTrigger } from "@/components/ui/password-input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend } from "@/components/ui/field";
import { IconAlertTriangle, IconEye, IconEyeOff, IconKey, IconLock, IconLockCheck, IconX } from "@tabler/icons-react";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const {
    form: { control, handleSubmit },
    mutation: { mutate, isPending, error },
  } = useResetPassword();

  const onSubmit = handleSubmit((data) => mutate({ data, token }));

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 mb-4">
            <IconKey className="text-primary" />
          </div>
          <FieldLegend className="text-xl! font-bold">Reset Password Akun</FieldLegend>
          <FieldDescription className="text-center">Silahkan perbaharui password untuk akun anda</FieldDescription>
        </div>

        {/* Password */}
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">
                Password Baru <span className="text-red-600">*</span>
              </FieldLabel>
              <PasswordInput
                render={(type, showPassword) => (
                  <div className="relative">
                    <InputGroup className="gap-0.5">
                      <InputGroupAddon align="inline-start">
                        <IconLock className="text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        type={type}
                        id="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Masukkan password baru disini..."
                        autoComplete="off"
                        disabled={isPending}
                      />
                      <PasswordTrigger>
                        <InputGroupAddon align="inline-end" className="text-muted-foreground cursor-pointer">
                          {showPassword ? <IconEye /> : <IconEyeOff />}
                        </InputGroupAddon>
                      </PasswordTrigger>
                    </InputGroup>
                  </div>
                )}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Confirm Password */}
        <Controller
          name="passwordConfirmation"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="passwordConfirmation">
                Konfirmasi Password <span className="text-red-600">*</span>
              </FieldLabel>
              <PasswordInput
                render={(type, showPassword) => (
                  <div className="relative">
                    <InputGroup className="gap-0.5">
                      <InputGroupAddon align="inline-start">
                        <IconLockCheck className="text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        type={type}
                        id="passwordConfirmation"
                        aria-invalid={fieldState.invalid}
                        placeholder="Konfirmasi password baru disini..."
                        autoComplete="off"
                        disabled={isPending}
                      />
                      <PasswordTrigger>
                        <InputGroupAddon align="inline-end" className="text-muted-foreground cursor-pointer">
                          {showPassword ? <IconEye /> : <IconEyeOff />}
                        </InputGroupAddon>
                      </PasswordTrigger>
                    </InputGroup>
                  </div>
                )}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Submit & Sent New Reset Link Button */}
        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Memproses" : "Simpan Password Baru"}
            {isPending && <Spinner data-icon="inline-start" />}
          </Button>
          {error && (
            <Link href="/lupa-password">
              <Button variant="outline" className="w-full" disabled={isPending}>
                Kirim Link Reset Password Baru
              </Button>
            </Link>
          )}
        </Field>

        {/* Error Alert */}
        {error && (
          <Closable>
            <Alert variant="destructive" className="border-none bg-destructive/10 pr-4!">
              <AlertTitle className="flex items-center gap-1.5">
                <IconAlertTriangle className="size-4" />
                Reset Password Gagal!
              </AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
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
      </FieldGroup>
    </form>
  );
}
