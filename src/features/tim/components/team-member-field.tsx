"use client";

import { cn } from "cn";
import { TeamMemberCard } from "./team-member-card";
import { TeamMemberInviter } from "./team-member-inviter";
import { useTeamFormContext } from "./team-form-provider";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";

export function TeamMemberField() {
  const { isTeamFull, teamMembers, form } = useTeamFormContext();

  const canInviteMember = !isTeamFull;

  const anggotaErrorFormState = form.formState.errors.anggota;
  const anggotaTimFieldError = anggotaErrorFormState?.root ?? anggotaErrorFormState;

  return (
    <Field>
      <FieldLabel htmlFor="anggotaTim" className={cn(anggotaTimFieldError && "text-destructive")}>
        Anggota Tim <span className="text-red-600">*</span>
      </FieldLabel>

      {anggotaTimFieldError ? (
        <FieldError errors={[anggotaTimFieldError]} />
      ) : (
        <FieldDescription>
          {isTeamFull ? "Tim anda sudah penuh! Anda tidak bisa menambah anggota lagi." : "Tim minimal memiliki 2 anggota, dan maksimal 5 anggota."}
        </FieldDescription>
      )}

      <div className="space-y-4">
        {canInviteMember && <TeamMemberInviter />}

        {teamMembers.map((member, index) => (
          <TeamMemberCard key={member.fieldId} member={member} index={index} />
        ))}
      </div>
    </Field>
  );
}
