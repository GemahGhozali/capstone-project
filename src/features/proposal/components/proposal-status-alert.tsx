"use client";

import Link from "next/link";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { StatusProposal } from "@/generated/prisma/enums";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconCircleCheck, IconCircleX, IconEdit, IconHourglass } from "@tabler/icons-react";

interface ProposalStatusAlertProps {
  proposalStatus: StatusProposal;
}

export function ProposalStatusAlert({ proposalStatus }: ProposalStatusAlertProps) {
  let alertTitle = "Proposal Tim Sedang Direview!";
  let alertDescription = "Proposal telah dikirim dan sedang ditinjau oleh Dosen Capstone Project.";
  let alertIcon = <IconHourglass />;
  let alertIconColor = "bg-yellow-500/15 text-yellow-500";

  if (proposalStatus === "Ditolak") {
    alertTitle = "Proposal Tim Ditolak!";
    alertDescription = "Silahkan periksa catatan evaluasi dari dosen dan tinjau ulang proposal anda.";
    alertIcon = <IconCircleX />;
    alertIconColor = "bg-red-500/15 text-red-500";
  }

  if (proposalStatus === "Revisi") {
    alertTitle = "Proposal Tim Perlu Direvisi!";
    alertDescription = "Silahkan periksa catatan evaluasi dari dosen dan perbaharui proposal anda.";
    alertIcon = <IconEdit />;
    alertIconColor = "bg-yellow-500/15 text-yellow-500";
  }

  if (proposalStatus === "Disetujui") {
    alertTitle = "Proposal Tim Telah Disetujui!";
    alertDescription = "Silahkan lanjut ke tahap pengajuan Resume dan Dosen Pembimbing";
    alertIcon = <IconCircleCheck />;
    alertIconColor = "bg-green-500/15 text-green-500";
  }

  return (
    <Card className="p-0">
      <CardHeader className="p-6 flex items-center flex-col gap-3 lg:flex-row">
        <div className={cn("size-12 grid place-content-center rounded-full shrink-0", alertIconColor)}>{alertIcon}</div>
        <div className="text-center lg:text-left">
          <CardTitle>{alertTitle}</CardTitle>
          <CardDescription>{alertDescription}</CardDescription>
        </div>
        {proposalStatus === "Disetujui" && (
          <Link href="/mahasiswa/upload-resume" className="w-full lg:w-auto lg:ml-auto">
            <Button className="w-full">Upload Resume</Button>
          </Link>
        )}
      </CardHeader>
    </Card>
  );
}
