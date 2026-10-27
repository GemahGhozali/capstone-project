import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusProposal } from "@/generated/prisma/enums";
import { proposalStatusStyles } from "../utils";
import { IconCircleCheck, IconCircleX, IconEdit, IconHourglass } from "@tabler/icons-react";
import { Callout, CalloutIcon, CalloutContent, CalloutTitle, CalloutDescription, CalloutAction } from "@/components/ui/callout";

type ProposalViewer = "Mahasiswa" | "Dosen";

interface ProposalStatusCalloutProps {
  currentProposalStatus: StatusProposal;
  viewer: ProposalViewer;
}

const statusStyles = {
  Menunggu: {
    icon: <IconHourglass />,
    iconColor: proposalStatusStyles["Menunggu"],
  },
  Ditolak: {
    icon: <IconCircleX />,
    iconColor: proposalStatusStyles["Ditolak"],
  },
  Revisi: {
    icon: <IconEdit />,
    iconColor: proposalStatusStyles["Revisi"],
  },
  Disetujui: {
    icon: <IconCircleCheck />,
    iconColor: proposalStatusStyles["Disetujui"],
  },
} as const;

const calloutMessages: Record<ProposalViewer, Record<StatusProposal, { title: string; description: string }>> = {
  Mahasiswa: {
    Menunggu: {
      title: "Proposal Tim Sedang Direview!",
      description: "Proposal telah dikirim dan sedang ditinjau oleh Dosen Capstone Project.",
    },
    Ditolak: {
      title: "Proposal Tim Ditolak!",
      description: "Silahkan periksa review dari dosen dan tinjau ulang proposal anda.",
    },
    Revisi: {
      title: "Proposal Tim Perlu Direvisi!",
      description: "Silahkan periksa review dari dosen dan perbaiki proposal anda.",
    },
    Disetujui: {
      title: "Proposal Tim Telah Disetujui!",
      description: "Silahkan lanjut ke tahap pengajuan Resume dan Dosen Pembimbing",
    },
  },
  Dosen: {
    Menunggu: {
      title: "Proposal Tim Perlu Direview!",
      description: "Silahkan tentukan status proposal dan berikan review anda kepada tim.",
    },
    Ditolak: {
      title: "Status Proposal : Ditolak",
      description: "Status proposal telah ditentukan. Anda hanya bisa memberikan review.",
    },
    Revisi: {
      title: "Status Proposal : Perlu Revisi",
      description: "Status proposal telah ditentukan. Anda hanya bisa memberikan review.",
    },
    Disetujui: {
      title: "Status Proposal : Disetujui",
      description: "Status proposal telah ditentukan. Anda hanya bisa memberikan review.",
    },
  },
};

export function ProposalStatusCallout({ currentProposalStatus, viewer }: ProposalStatusCalloutProps) {
  const { icon, iconColor } = statusStyles[currentProposalStatus];
  const { title, description } = calloutMessages[viewer][currentProposalStatus];

  return (
    <Callout>
      <CalloutIcon className={iconColor}>{icon}</CalloutIcon>
      <CalloutContent>
        <CalloutTitle>{title}</CalloutTitle>
        <CalloutDescription>{description}</CalloutDescription>
      </CalloutContent>
      {viewer === "Mahasiswa" && currentProposalStatus === "Disetujui" && (
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
