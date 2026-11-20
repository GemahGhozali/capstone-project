"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { StatusBimbingan } from "@/generated/prisma/enums";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useApproveBimbingan, useRejectBimbingan } from "../hooks";

interface VerifyBimbinganButtonProps {
  id: string;
  status: StatusBimbingan;
}

export function VerifyBimbinganButton({ id, status }: VerifyBimbinganButtonProps) {
  const { mutate: approveBimbingan, isPending: isApprovePending } = useApproveBimbingan();
  const { mutate: rejectBimbingan, isPending: isRejectPending } = useRejectBimbingan();

  const canApprove = status === "Menunggu" || status === "Ditolak";
  const canReject = status === "Menunggu" || status === "Disetujui";

  return (
    <>
      {canApprove && (
        <Button variant="success" size="icon-sm" onClick={() => approveBimbingan(id)} disabled={isApprovePending}>
          {isApprovePending ? <Spinner /> : <IconCheck />}
        </Button>
      )}
      {canReject && (
        <Button variant="destructive" size="icon-sm" onClick={() => rejectBimbingan(id)} disabled={isRejectPending}>
          {isRejectPending ? <Spinner /> : <IconX />}
        </Button>
      )}
    </>
  );
}
