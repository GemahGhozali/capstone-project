"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTeamForm } from "../hooks";
import { TeamMemberField } from "./team-member-field";
import { Card, CardContent } from "@/components/ui/card";
import { AuthenticatedUserData } from "@/features/auth/types";
import { Controller, FormProvider } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

interface TimFormProps {
  ketua: AuthenticatedUserData;
}

export function TimForm({ ketua }: TimFormProps) {
  const { form, teamMembers, addMember, removeMember, mahasiswaAlreadyInTeam, isTeamFull, mutation } = useTeamForm({ ketua });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <Card>
      <CardContent className="gap-6">
        <FormProvider {...form}>
          <form onSubmit={onSubmit}>
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
              />

              <Field orientation="horizontal" className="items-stretch flex-col sm:flex-row sm:justify-end">
                <Button type="submit" size="lg" disabled={mutation.isPending} className="sm:order-2">
                  {mutation.isPending ? "Memproses" : "Buat Tim Capstone"}
                  {mutation.isPending && <Spinner data-icon="inline-start" />}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
