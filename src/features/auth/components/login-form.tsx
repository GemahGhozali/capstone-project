"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "../hooks";
import { Controller } from "react-hook-form";
import { Closable, ClosableTrigger } from "@/components/ui/closable";
import { PasswordInput, PasswordTrigger } from "@/components/ui/password-input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconAlertTriangle, IconEye, IconEyeOff, IconLock, IconSchool, IconUser, IconX } from "@tabler/icons-react";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend } from "@/components/ui/field";

export function LoginForm() {
  const {
    form: { control, handleSubmit },
    mutation: { mutate, isPending, error },
  } = useLogin();

  const onSubmit = handleSubmit((data) => mutate(data));

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <div className="flex flex-col items-center">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 mb-4">
            <IconSchool className="text-primary" />
          </div>
          <FieldLegend className="text-xl! font-bold">Aplikasi Capstone Project</FieldLegend>
          <FieldDescription>Silahkan login terlebih dahulu untuk mengakses aplikasi</FieldDescription>
        </div>
        <Controller
          name="identifier"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="identifier">
                NIM/NIP <span className="text-red-600">*</span>
              </FieldLabel>
              <InputGroup className="gap-0.5">
                <InputGroupInput
                  {...field}
                  type="text"
                  id="identifier"
                  aria-invalid={fieldState.invalid}
                  placeholder="Masukkan NIM/NIP disini..."
                  autoComplete="off"
                  disabled={isPending}
                />
                <InputGroupAddon align="inline-start">
                  <IconUser className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex justify-between">
                <FieldLabel htmlFor="password">
                  Password <span className="text-red-600">*</span>
                </FieldLabel>
                <Link href="/lupa-password">
                  <FieldDescription className="text-primary underline-offset-2 hover:underline">Lupa Password?</FieldDescription>
                </Link>
              </div>
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
                        placeholder="Masukkan password disini..."
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
        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Memproses" : "Login"}
            {isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </Field>
        {error && (
          <Closable>
            <Alert variant="destructive" className="border-none bg-destructive/10">
              <AlertTitle className="flex items-center gap-1.5">
                <IconAlertTriangle className="size-4" />
                Login Gagal!
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
