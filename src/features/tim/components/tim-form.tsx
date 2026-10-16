"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTeamForm } from "../hooks";
import { IconCircleCheck } from "@tabler/icons-react";
import { TeamMemberField } from "./team-member-field";
import { TeamMemberInput } from "../schemas";
import { Controller, FormProvider } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TimFormProps {
  teamData: {
    id?: string;
    nama?: string;
    anggota: TeamMemberInput[];
  };
}

export function TimForm({ teamData }: TimFormProps) {
  const { form, mutation, teamMembers, addMember, removeMember, mahasiswaAlreadyInTeam, isTeamFull } = useTeamForm({ teamData });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  const isEditMode = Boolean(teamData.id);

  const allTeamMemberApproved = teamData.anggota.every((member) => member.statusPersetujuan === "Disetujui");
  const canUploadProposal = allTeamMemberApproved && teamData.anggota.length > 1;

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Quick Action (Upload Proposal) */}
        {canUploadProposal && (
          <Card className="p-0 mb-6">
            <CardHeader className="flex flex-col items-center gap-4 p-6 lg:flex-row">
              <div className="flex items-center flex-col gap-3 lg:flex-row">
                <div className="bg-green-500/15 text-green-500 size-12 grid place-content-center rounded-full shrink-0 ">
                  <IconCircleCheck />
                </div>
                <div className="text-center lg:text-left">
                  <CardTitle>Anda Sudah Bisa Upload Proposal!</CardTitle>
                  <CardDescription>Semua anggota tim telah menyetujui undangan.</CardDescription>
                </div>
              </div>
              <Link href="/mahasiswa/upload-proposal" className="w-full lg:w-auto lg:ml-auto">
                <Button className="w-full">Upload Proposal</Button>
              </Link>
            </CardHeader>
          </Card>
        )}
        <Card className="max-sm:p-0 max-sm:ring-0 max-sm:rounded-none max-sm:overflow-visible p-6">
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
            <TeamMemberField
              teamMembers={teamMembers}
              addMember={addMember}
              removeMember={removeMember}
              isTeamFull={isTeamFull}
              mahasiswaAlreadyInTeam={mahasiswaAlreadyInTeam}
              disabled={mutation.isPending}
              isEditMode={isEditMode}
            />

            <Field orientation="horizontal">
              <Button type="submit" size="lg" disabled={mutation.isPending} className="w-full">
                {mutation.isPending ? "Memproses" : isEditMode ? "Update Tim Capstone Project" : "Buat Tim Project"}
                {mutation.isPending && <Spinner data-icon="inline-start" />}
              </Button>
            </Field>
          </FieldGroup>
        </Card>
      </form>
    </FormProvider>
  );
}
