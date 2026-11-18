"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { StatusResume } from "@/generated/prisma/enums";
import { useToggleArchiveResume } from "../hooks";
import { IconArchive, IconRefresh } from "@tabler/icons-react";

interface ArchiveResumeButtonProps {
  id: string;
  status: StatusResume;
}

export function ArchiveResumeButton({ id, status }: ArchiveResumeButtonProps) {
  const resumeIsArchived = status === "Arsip";
  const { mutate: toggleArchiveResume, isPending } = useToggleArchiveResume();

  return (
    <Button variant="outline" size="icon-sm" disabled={isPending} onClick={() => toggleArchiveResume({ id, status })}>
      {isPending ? <Spinner /> : resumeIsArchived ? <IconRefresh /> : <IconArchive />}
    </Button>
  );
}
