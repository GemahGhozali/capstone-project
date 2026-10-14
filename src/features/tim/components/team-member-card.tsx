"use client";

import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";
import { TeamInput } from "../schemas";
import { FieldArrayWithId } from "react-hook-form";
import { generateNameInitials } from "@/utils/generate-name-initials";
import { CapstoneCategoryRadioGroup } from "./capstone-category-radio-group";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type TeamMember = FieldArrayWithId<TeamInput, "anggota", "fieldId">;

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
  disabled: boolean;
  onRemove: (index: number) => void;
}

export function TeamMemberCard({ member, index, disabled, onRemove }: TeamMemberCardProps) {
  const canRemove = index !== 0;

  return (
    <Card className="p-0 gap-0 divide-y">
      <CardHeader className="p-4 flex items-center gap-3 relative">
        <div className="flex gap-3 md:items-center max-md:flex-col">
          <Avatar size="lg">
            <AvatarImage src={member.fotoProfil ?? ""} alt={member.namaLengkap} />
            <AvatarFallback>{generateNameInitials(member.namaLengkap)}</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <span className="line-clamp-1 text-sm font-medium">{member.namaLengkap}</span>
            <p className="line-clamp-1 text-xs text-muted-foreground">{member.nim}</p>
          </div>
        </div>
        {canRemove && (
          <>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="ml-auto max-md:hidden"
              onClick={() => onRemove(index)}
              disabled={disabled}
            >
              Hapus
              <IconTrash data-icon="inline-end" />
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="destructive"
              className="absolute top-4 right-4 md:hidden"
              onClick={() => onRemove(index)}
              disabled={disabled}
            >
              <IconTrash data-icon="inline-end" />
            </Button>
          </>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <CapstoneCategoryRadioGroup memberIndex={index} />
      </CardContent>
    </Card>
  );
}
