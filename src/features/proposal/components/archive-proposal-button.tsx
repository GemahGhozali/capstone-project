"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { StatusProposal } from "@/generated/prisma/enums";
import { useToggleArchiveProposal } from "../hooks";
import { IconArchive, IconRefresh } from "@tabler/icons-react";

interface ArchiveProposalButtonProps {
  id: string;
  status: StatusProposal;
}

export function ArchiveProposalButton({ id, status }: ArchiveProposalButtonProps) {
  const proposalIsArchived = status === "Arsip";
  const { mutate: toggleArhiceveProposal, isPending } = useToggleArchiveProposal();

  return (
    <Button variant="outline" size="icon-sm" disabled={isPending} onClick={() => toggleArhiceveProposal({ id, status })}>
      {isPending ? <Spinner /> : proposalIsArchived ? <IconRefresh /> : <IconArchive />}
    </Button>
  );
}
