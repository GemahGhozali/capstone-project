import { ResumeViewer } from "../types";
import { StatusResume } from "@/generated/prisma/enums";
import { resumeStatusStyles } from "../utils";
import { IconCircleCheck, IconCircleX, IconHourglass } from "@tabler/icons-react";
import { Callout, CalloutIcon, CalloutContent, CalloutTitle, CalloutDescription } from "@/components/ui/callout";

interface ResumeStatusCalloutProps {
  resumeStatus: StatusResume;
  viewer: ResumeViewer;
  dosenPembimbing: string;
}

const statusStyles = {
  Menunggu: {
    icon: <IconHourglass />,
    iconColor: resumeStatusStyles["Menunggu"],
  },
  Ditolak: {
    icon: <IconCircleX />,
    iconColor: resumeStatusStyles["Ditolak"],
  },
  Disetujui: {
    icon: <IconCircleCheck />,
    iconColor: resumeStatusStyles["Disetujui"],
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
  Kaprodi: {
    Menunggu: {
      title: "Resume Mahasiswa Belum Direview.",
      description: "Dosen pembimbing belum memberikan review apapun pada resume ini.",
    },
    Ditolak: {
      title: "Status Resume : Ditolak",
      description: "Dosen pembimbing telah menolak pengajuan resume ini.",
    },
    Disetujui: {
      title: "Status Resume : Disetujui",
      description: "Dosen pembimbing telah resmi menerima mahasiswa dalam daftar bimbingannya.",
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
