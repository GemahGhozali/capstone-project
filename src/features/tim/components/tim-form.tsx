"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Controller } from "react-hook-form";
import { IconCircleCheck } from "@tabler/icons-react";
import { TeamMemberField } from "./team-member-field";
import { TeamMemberInput } from "../schemas";
import { TeamFormProvider } from "./team-form-provider";
import { useTeamFormContext } from "./team-form-provider";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Callout, CalloutAction, CalloutContent, CalloutDescription, CalloutIcon, CalloutTitle } from "@/components/ui/callout";

interface TimFormProps {
  teamData: {
    id?: string;
    nama?: string;
    anggota: TeamMemberInput[];
  };
}

export function TimForm({ teamData }: TimFormProps) {
  return (
    <TeamFormProvider teamData={teamData}>
      <TimFormFields teamData={teamData} />
    </TeamFormProvider>
  );
}

function TimFormFields({ teamData }: TimFormProps) {
  const { form, mutation, isEditMode } = useTeamFormContext();

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  const allTeamMemberApproved = teamData.anggota.every((member) => member.statusPersetujuan === "Disetujui");
  const canUploadProposal = allTeamMemberApproved && teamData.anggota.length > 1;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Kelola Tim</h1>
        <p className="text-muted-foreground text-sm">Atur anggota tim beserta kategori capstone-nya</p>
      </div>

      {/* Quick Action (Upload Proposal) */}
      {canUploadProposal && (
        <Callout>
          <CalloutIcon className="bg-green-500/15 text-green-500">
            <IconCircleCheck />
          </CalloutIcon>
          <CalloutContent>
            <CalloutTitle>Anda Sudah Bisa Upload Proposal!</CalloutTitle>
            <CalloutDescription>Semua anggota tim telah menyetujui undangan.</CalloutDescription>
          </CalloutContent>
          <CalloutAction render={<Link href="/mahasiswa/upload-proposal" />}>
            <Button className="w-full">Upload Proposal</Button>
          </CalloutAction>
        </Callout>
      )}

      <FieldGroup>
        {/* Nama Tim */}
        <Controller
          name="namaTim"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="namaTim">
                Nama Tim <span className="text-red-600">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="namaTim"
                placeholder="Masukkan nama tim disini..."
                aria-invalid={fieldState.invalid}
                disabled={mutation.isPending}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Anggota Tim */}
        <TeamMemberField />

        <Field orientation="horizontal">
          <Button type="submit" size="lg" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? "Memproses" : isEditMode ? "Update Tim Capstone Project" : "Buat Tim Project"}
            {mutation.isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
