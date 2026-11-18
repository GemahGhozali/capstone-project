"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { StatusProposal } from "@/generated/prisma/enums";
import { useToggleArchieveProposal } from "../hooks";
import { IconArchive, IconRefresh } from "@tabler/icons-react";

interface ArchieveProposalButtonProps {
  id: string;
  status: StatusProposal;
}

export function ArchieveProposalButton({ id, status }: ArchieveProposalButtonProps) {
  const proposalIsArchived = status === "Arsip";
  const { mutate: toggleArhiceveProposal, isPending } = useToggleArchieveProposal();

  return (
    <Button variant="outline" size="icon-sm" disabled={isPending} onClick={() => toggleArhiceveProposal({ id, status })}>
      {isPending ? <Spinner /> : proposalIsArchived ? <IconRefresh /> : <IconArchive />}
    </Button>
  );
}
