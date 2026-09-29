"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Controller } from "react-hook-form";
import { useForgotPassword } from "../hooks";
import { Closable, ClosableTrigger } from "@/components/ui/closable";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconAlertTriangle, IconCheck, IconLockQuestion, IconMail, IconUser, IconX } from "@tabler/icons-react";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldTitle } from "@/components/ui/field";

export function ForgotPasswordForm() {
  const {
    selectedResetOption,
    handleSelectResetOption,
    form: { control, handleSubmit },
    mutation: { mutate, isPending, isSuccess, data, error },
  } = useForgotPassword();

  const onSubmit = handleSubmit((data) => mutate(data));

  const isEmail = selectedResetOption === "email";
  const inputType = isEmail ? "email" : "text";
  const labelText = isEmail ? "Alamat Email" : "NIM/NIP";
  const placeholderText = isEmail ? "Masukkan alamat email anda..." : "Masukkan NIM/NIP anda disini...";
  const IconComponent = isEmail ? IconMail : IconUser;

  if (isSuccess) {
    return <ResetPasswordLinkSuccessfullySent message={data.message} />;
  }

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 mb-4">
            <IconLockQuestion className="text-primary" />
          </div>
          <FieldLegend className="text-xl! font-bold">Lupa Password Akun</FieldLegend>
          <FieldDescription className="text-center">Pilih metode pemulihan untuk mereset password akun Anda.</FieldDescription>
        </div>

        {/* Reset Option */}
        <RadioGroup defaultValue="email" value={selectedResetOption} onValueChange={(value) => handleSelectResetOption(value)} disabled={isPending}>
          {/* Email Option */}
          <FieldLabel htmlFor="email">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>Email</FieldTitle>
                <FieldDescription>Gunakan email yang terdaftar untuk reset password</FieldDescription>
              </FieldContent>
              <RadioGroupItem value="email" id="email" />
            </Field>
          </FieldLabel>
          {/* Identifier Option (NIM/NIP) */}
          <FieldLabel htmlFor="identifier">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>NIM/NIP</FieldTitle>
                <FieldDescription>Alternatif reset password jika lupa dengan email anda</FieldDescription>
              </FieldContent>
              <RadioGroupItem value="identifier" id="identifier" />
            </Field>
          </FieldLabel>
        </RadioGroup>

        {/* Email or NIM/NIP (Identifier) */}
        <Controller
          name="credential"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="credential">
                {labelText} <span className="text-red-600">*</span>
              </FieldLabel>
              <FieldDescription></FieldDescription>
              <InputGroup className="gap-0.5">
                <InputGroupInput
                  {...field}
                  type={inputType}
                  id="credential"
                  aria-invalid={fieldState.invalid}
                  placeholder={placeholderText}
                  autoComplete="off"
                  disabled={isPending}
                />
                <InputGroupAddon align="inline-start">
                  <IconComponent className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Submit & Back To Login Button */}
        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Memproses" : "Kirim Link Reset Password"}
            {isPending && <Spinner data-icon="inline-start" />}
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full" disabled={isPending}>
              Kembali Ke Halaman Login
            </Button>
          </Link>
        </Field>

        {/* Error Alert */}
        {error && (
          <Closable>
            <Alert variant="destructive" className="border-none bg-destructive/10 pr-4!">
              <AlertTitle className="flex items-center gap-1.5">
                <IconAlertTriangle className="size-4" />
                Gagal Mengirim Link Reset Password!
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

function ResetPasswordLinkSuccessfullySent({ message }: { message: string }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <div className="flex size-10 items-center justify-center bg-green-500 rounded-full mb-4">
          <IconCheck className="text-white" stroke={3.5} />
        </div>
        <h1 className="text-xl font-bold mb-3">Link Reset Berhasil Dikirim</h1>
        <p className="text-muted-foreground text-sm text-center">{message}</p>
      </div>
      <div className="flex flex-col gap-4">
        <Link href="https://mail.google.com" target="_blank">
          <Button className="w-full">Cek Inbox Email</Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="w-full">
            Kembali Ke Halaman Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
