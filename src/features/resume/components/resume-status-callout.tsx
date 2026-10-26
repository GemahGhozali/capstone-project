import { StatusResume } from "@/generated/prisma/enums";
import { IconCircleCheck, IconCircleX, IconHourglass } from "@tabler/icons-react";
import { Callout, CalloutIcon, CalloutContent, CalloutTitle, CalloutDescription } from "@/components/ui/callout";

type ResumeViewer = "Mahasiswa" | "Dosen";

interface ResumeStatusCalloutProps {
  resumeStatus: StatusResume;
  viewer: ResumeViewer;
  dosenPembimbing: string;
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
  Disetujui: {
    icon: <IconCircleCheck />,
    iconColor: "bg-green-500/15 text-green-500",
  },
} as const;

const calloutMessages: Record<ResumeViewer, Record<StatusResume, { title: string; description: string }>> = {
  Mahasiswa: {
    Menunggu: {
      title: "Resume Anda Sedang Direview!",
      description: "Resume telah dikirim dan sedang ditinjau oleh Dosen Pembimbing.",
    },
    Ditolak: {
      title: "Resume Anda Ditolak!",
      description: "Silahkan periksa catatan evaluasi dari dosen dan tinjau ulang resume anda.",
    },
    Disetujui: {
      title: "Resume Anda Telah Disetujui!",
      description: "",
    },
  },
  Dosen: {
    Menunggu: {
      title: "Resume Mahasiswa Perlu Direview!",
      description: "Silahkan tentukan status resume dan berikan review anda kepada mahasiswa.",
    },
    Ditolak: {
      title: "Status Resume : Ditolak",
      description: "Anda telah menolak pengajuan resume mahasiswa ini.",
    },
    Disetujui: {
      title: "Status Resume : Disetujui",
      description: "Mahasiswa telah resmi diterima masuk ke dalam bimbingan Anda.",
    },
  },
};

export function ResumeStatusCallout({ resumeStatus, viewer, dosenPembimbing }: ResumeStatusCalloutProps) {
  const { icon, iconColor } = statusStyles[resumeStatus];
  const { title, description } = calloutMessages[viewer][resumeStatus];

  const finalDescription =
    viewer === "Mahasiswa" && resumeStatus === "Disetujui" ? `${dosenPembimbing} telah ditetapkan sebagai dosen pembimbing anda.` : description;

  return (
    <Callout>
      <CalloutIcon className={iconColor}>{icon}</CalloutIcon>
      <CalloutContent>
        <CalloutTitle>{title}</CalloutTitle>
        <CalloutDescription>{finalDescription}</CalloutDescription>
      </CalloutContent>
    </Callout>
  );
}
