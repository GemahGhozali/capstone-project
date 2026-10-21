"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusProposal } from "@/generated/prisma/enums";
import { IconCircleCheck, IconCircleX, IconEdit, IconHourglass } from "@tabler/icons-react";
import { Callout, CalloutIcon, CalloutContent, CalloutTitle, CalloutDescription, CalloutAction } from "@/components/ui/callout";

interface ProposalStatusCalloutProps {
  proposalStatus: StatusProposal;
}

export function ProposalStatusCallout({ proposalStatus }: ProposalStatusCalloutProps) {
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
    <Callout>
      <CalloutIcon className={alertIconColor}>{alertIcon}</CalloutIcon>
      <CalloutContent>
        <CalloutTitle>{alertTitle}</CalloutTitle>
        <CalloutDescription>{alertDescription}</CalloutDescription>
      </CalloutContent>
      {proposalStatus === "Disetujui" && (
        <CalloutAction
          render={
            <Link href="/mahasiswa/upload-resume" className="w-full">
              <Button className="w-full">Upload Resume</Button>
            </Link>
          }
        />
      )}
    </Callout>
  );
}
