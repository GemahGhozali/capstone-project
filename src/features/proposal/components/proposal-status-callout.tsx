import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusProposal } from "@/generated/prisma/enums";
import { IconCircleCheck, IconCircleX, IconEdit, IconHourglass } from "@tabler/icons-react";
import { Callout, CalloutIcon, CalloutContent, CalloutTitle, CalloutDescription, CalloutAction } from "@/components/ui/callout";

type ProposalViewer = "Mahasiswa" | "Dosen";

interface ProposalStatusCalloutProps {
  proposalStatus: StatusProposal;
  viewer: ProposalViewer;
}

const statusStyles = {
  Menunggu: {
    icon: <IconHourglass />,
    iconColor: "bg-yellow-500/15 text-yellow-500",
  },
  Ditolak: {
    icon: <IconCircleX />,
    iconColor: "bg-red-500/15 text-red-500",
  },
  Revisi: {
    icon: <IconEdit />,
    iconColor: "bg-yellow-500/15 text-yellow-500",
  },
  Disetujui: {
    icon: <IconCircleCheck />,
    iconColor: "bg-green-500/15 text-green-500",
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
      description: "Silahkan periksa catatan evaluasi dari dosen dan tinjau ulang proposal anda.",
    },
    Revisi: {
      title: "Proposal Tim Perlu Direvisi!",
      description: "Silahkan periksa catatan evaluasi dari dosen dan perbaharui proposal anda.",
    },
    Disetujui: {
      title: "Proposal Tim Telah Disetujui!",
      description: "Silahkan lanjut ke tahap pengajuan Resume dan Dosen Pembimbing",
    },
  },
  Dosen: {
    Menunggu: {
      title: "Proposal Tim Belum Direview!",
      description: "Silahkan tentukan status proposal dan berikan review anda kepada tim.",
    },
    Ditolak: {
      title: "Proposal Tim Ditolak!",
      description: "Status proposal telah ditentukan. Anda hanya bisa memberikan feedback.",
    },
    Revisi: {
      title: "Proposal Tim Perlu Direvisi!",
      description: "Status proposal telah ditentukan. Anda hanya bisa memberikan feedback.",
    },
    Disetujui: {
      title: "Proposal Tim Telah Disetujui!",
      description: "Status proposal telah ditentukan. Anda hanya bisa memberikan feedback.",
    },
  },
};

export function ProposalStatusCallout({ proposalStatus, viewer }: ProposalStatusCalloutProps) {
  const { icon, iconColor } = statusStyles[proposalStatus];
  const { title, description } = calloutMessages[viewer][proposalStatus];

  return (
    <Callout>
      <CalloutIcon className={iconColor}>{icon}</CalloutIcon>
      <CalloutContent>
        <CalloutTitle>{title}</CalloutTitle>
        <CalloutDescription>{description}</CalloutDescription>
      </CalloutContent>
      {viewer === "Mahasiswa" && proposalStatus === "Disetujui" && (
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
