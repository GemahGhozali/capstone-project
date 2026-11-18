"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { StatusTim } from "@/generated/prisma/enums";
import { useToggleArchiveTim } from "../hooks";
import { IconArchive, IconRefresh } from "@tabler/icons-react";

interface ArchiveTeamButtonProps {
  id: string;
  status: StatusTim;
}

export function ArchiveTeamButton({ id, status }: ArchiveTeamButtonProps) {
  const teamIsArchived = status === "Arsip";
  const { mutate: toggleArchiveTim, isPending } = useToggleArchiveTim();

  return (
    <Button variant="outline" size="icon-sm" disabled={isPending} onClick={() => toggleArchiveTim({ id, status })}>
      {isPending ? <Spinner /> : teamIsArchived ? <IconRefresh /> : <IconArchive />}
    </Button>
  );
}
