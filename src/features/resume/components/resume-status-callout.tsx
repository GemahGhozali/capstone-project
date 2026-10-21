import { StatusResume } from "@/generated/prisma/enums";
import { IconCircleCheck, IconCircleX, IconHourglass } from "@tabler/icons-react";
import { Callout, CalloutIcon, CalloutContent, CalloutTitle, CalloutDescription } from "@/components/ui/callout";

interface ResumeStatusCalloutProps {
  resumeStatus: StatusResume;
  dosenPembimbing: string;
}

export function ResumeStatusCallout({ resumeStatus, dosenPembimbing }: ResumeStatusCalloutProps) {
  let alertTitle = "Resume Anda Sedang Direview!";
  let alertDescription = "Resume telah dikirim dan sedang ditinjau oleh Dosen Pembimbing.";
  let alertIconColor = "bg-yellow-500/15 text-yellow-500";
  let alertIcon = <IconHourglass />;

  if (resumeStatus === "Ditolak") {
    alertTitle = "Resume Anda Ditolak!";
    alertDescription = "Silahkan periksa catatan evaluasi dari dosen dan tinjau ulang resume anda.";
    alertIconColor = "bg-red-500/15 text-red-500";
    alertIcon = <IconCircleX />;
  }

  if (resumeStatus === "Disetujui") {
    alertTitle = "Resume Anda Telah Disetujui!";
    alertDescription = `${dosenPembimbing} telah ditetapkan sebagai dosen pembimbing anda.`;
    alertIconColor = "bg-green-500/15 text-green-500";
    alertIcon = <IconCircleCheck />;
  }

  return (
    <Callout>
      <CalloutIcon className={alertIconColor}>{alertIcon}</CalloutIcon>
      <CalloutContent>
        <CalloutTitle>{alertTitle}</CalloutTitle>
        <CalloutDescription>{alertDescription}</CalloutDescription>
      </CalloutContent>
    </Callout>
  );
}
