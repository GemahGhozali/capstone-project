"use client";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TeamInput } from "../schemas";
import { FieldArrayWithId } from "react-hook-form";
import { IconNut, IconTrash } from "@tabler/icons-react";
import { generateNameInitials } from "@/utils/generate-name-initials";
import { CapstoneCategoryRadioGroup } from "./capstone-category-radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

type TeamMember = FieldArrayWithId<TeamInput, "anggota", "fieldId">;

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
  disabled: boolean;
  onRemove: (index: number) => void;
  isEditMode: boolean;
}

export function TeamMemberCard({ isEditMode, member, index, disabled, onRemove }: TeamMemberCardProps) {
  const canRemove = member.peran !== "Ketua";

  return (
    <Card className="p-0 gap-0">
      <CardHeader className="p-4 flex items-center gap-3 relative">
        <div className="flex gap-3 md:items-center max-md:flex-col">
          <Avatar size="lg">
            <AvatarImage src={member.fotoProfil ?? ""} alt={member.namaLengkap} />
            <AvatarFallback>{generateNameInitials(member.namaLengkap)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="line-clamp-1 text-sm font-medium">{member.namaLengkap}</p>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {member.peran} - {member.nim}
            </p>
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
      <CardContent className="p-4 pt-0">
        <CapstoneCategoryRadioGroup memberIndex={index} />
      </CardContent>
      {isEditMode && (
        <CardFooter className="p-4! border-t justify-between">
          <p className="text-sm flex items-center gap-1.5 text-muted-foreground">
            <IconNut className="size-4" /> Persetujuan :
          </p>
          <Badge
            className={cn(
              member.statusPersetujuan === "Menunggu" && "text-yellow-500 bg-yellow-500/15",
              member.statusPersetujuan === "Disetujui" && "text-green-500 bg-green-500/15",
            )}
          >
            {member.statusPersetujuan}
          </Badge>
        </CardFooter>
      )}
    </Card>
  );
}
