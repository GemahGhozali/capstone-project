"use client";

import { cn } from "cn";
import { TeamInput } from "../schemas";
import { TeamMemberCard } from "./team-member-card";
import { TeamMemberInviter } from "./team-member-inviter";
import { SearchMahasiswaResult } from "../types";
import { useFormContext, FieldArrayWithId } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";

type TeamMemberItem = FieldArrayWithId<TeamInput, "anggota", "fieldId">;

interface TeamMemberFieldProps {
  teamMembers: TeamMemberItem[];
  addMember: (mahasiswa: SearchMahasiswaResult) => void;
  removeMember: (index: number) => void;
  mahasiswaAlreadyInTeam: (id: string) => boolean;
  isTeamFull: boolean;
  isEditMode: boolean;
  disabled: boolean;
}

export function TeamMemberField({
  isTeamFull,
  isEditMode,
  teamMembers,
  addMember,
  removeMember,
  mahasiswaAlreadyInTeam,
  disabled,
}: TeamMemberFieldProps) {
  const form = useFormContext<TeamInput>();

  const anggotaErrorFormState = form.formState.errors.anggota;
  const anggotaTimFieldError = anggotaErrorFormState?.root ?? anggotaErrorFormState;

  const canInviteMember = !isTeamFull;

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
        {canInviteMember && (
          <TeamMemberInviter isTeamFull={isTeamFull} disabled={disabled} mahasiswaAlreadyInTeam={mahasiswaAlreadyInTeam} onInvite={addMember} />
        )}

        {teamMembers.map((member, index) => (
          <TeamMemberCard key={member.fieldId} member={member} index={index} disabled={disabled} onRemove={removeMember} isEditMode={isEditMode} />
        ))}
      </div>
    </Field>
  );
}
