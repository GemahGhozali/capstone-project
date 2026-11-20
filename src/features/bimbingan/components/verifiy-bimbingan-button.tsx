"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { StatusBimbingan } from "@/generated/prisma/enums";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useApproveBimbingan, useRejectBimbingan } from "../hooks";

interface VerifyBimbinganButtonProps {
  id: string;
  status: StatusBimbingan;
  showLabel?: boolean;
}

export function VerifyBimbinganButton({ id, status, showLabel = false }: VerifyBimbinganButtonProps) {
  const { mutate: approveBimbingan, isPending: isApprovePending } = useApproveBimbingan();
  const { mutate: rejectBimbingan, isPending: isRejectPending } = useRejectBimbingan();

  const size = showLabel ? "sm" : "icon-sm";
  const canApprove = status === "Menunggu" || status === "Ditolak";
  const canReject = status === "Menunggu" || status === "Disetujui";

  return (
    <>
      {canApprove && (
        <Button size={size} variant="success" disabled={isApprovePending} onClick={() => approveBimbingan(id)}>
          {showLabel && (isApprovePending ? "Memproses" : "Setujui")}
          {isApprovePending ? (
            <Spinner data-icon={showLabel ? "inline-end" : undefined} />
          ) : (
            <IconCheck data-icon={showLabel ? "inline-end" : undefined} />
          )}
        </Button>
      )}
      {canReject && (
        <Button size={size} variant="destructive" disabled={isRejectPending} onClick={() => rejectBimbingan(id)}>
          {showLabel && (isRejectPending ? "Memproses" : "Tolak")}
          {isRejectPending ? (
            <Spinner data-icon={showLabel ? "inline-end" : undefined} />
          ) : (
            <IconX data-icon={showLabel ? "inline-end" : undefined} />
          )}
        </Button>
      )}
    </>
  );
}
