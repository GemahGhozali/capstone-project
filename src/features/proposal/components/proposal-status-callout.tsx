import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusProposal } from "@/generated/prisma/enums";
import { ProposalViewer } from "../types";
import { proposalStatusStyles } from "../utils";
import { IconCircleCheck, IconCircleX, IconEdit, IconHourglass, IconArchive } from "@tabler/icons-react";
import { Callout, CalloutIcon, CalloutContent, CalloutTitle, CalloutDescription, CalloutAction } from "@/components/ui/callout";

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
  Arsip: {
    icon: <IconArchive />,
    iconColor: proposalStatusStyles["Arsip"],
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
    Arsip: {
      title: "Proposal Tim Telah Diarsipkan!",
      description: "Proposal ini telah diarsipkan oleh Kaprodi dan tidak dapat diubah.",
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
    Arsip: {
      title: "Status Proposal : Arsip",
      description: "Proposal ini telah diarsipkan oleh Kaprodi dan tidak dapat direview kembali.",
    },
  },
  Kaprodi: {
    Menunggu: {
      title: "Proposal Tim Belum Direview!",
      description: "Dosen Capstone Project belum menentukan status proposal dan memberi review kepada tim.",
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
    Arsip: {
      title: "Status Proposal : Arsip",
      description: "Proposal telah diarsipkan dan tidak dapat direview kembali.",
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
