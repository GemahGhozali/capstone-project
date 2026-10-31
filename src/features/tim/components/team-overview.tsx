import { cn } from "cn";
import { StatusProposal } from "@/generated/prisma/enums";
import { TeamMemberInput } from "../schemas";
import { TeamMemberOverviewCard } from "./team-member-overview-card";
import { IconCircleCheck, IconInfoCircle, IconLock } from "@tabler/icons-react";
import { Callout, CalloutIcon, CalloutContent, CalloutTitle, CalloutDescription } from "@/components/ui/callout";

interface TeamOverviewProps {
  teamName: string;
  teamMembers: TeamMemberInput[];
  statusProposal: StatusProposal | "Tidak Ada";
}

export function TeamOverview({ teamMembers, statusProposal, teamName }: TeamOverviewProps) {
  const proposalUploaded = statusProposal === "Menunggu";
  const proposalApproved = statusProposal === "Disetujui";

  let alertTitle = "Anda Tidak Bisa Mengelola Tim!";
  let alertDescription = "Hanya ketua tim yang memiliki akses untuk mengelola tim.";

  if (proposalUploaded) {
    alertTitle = "Tim Capstone Anda Terkunci!";
    alertDescription = "Anda tidak bisa merubah tim anda karena proposal tim anda sedang di review.";
  }

  if (proposalApproved) {
    alertTitle = "Tim Capstone Anda Telah Disetujui!";
    alertDescription = "Anda tidak bisa merubah tim anda lagi karena proposal tim anda telah disetujui.";
  }

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Detail Tim Capstone Project</h1>
        <p className="text-muted-foreground text-sm">{teamName}</p>
      </div>
      <Callout>
        <CalloutIcon
          className={cn(
            "bg-blue-500/15 text-blue-500",
            proposalApproved && "bg-green-500/15 text-green-500",
            proposalUploaded && "bg-yellow-500/15 text-yellow-500",
          )}
        >
          {proposalApproved ? <IconCircleCheck /> : proposalUploaded ? <IconLock /> : <IconInfoCircle />}
        </CalloutIcon>
        <CalloutContent>
          <CalloutTitle>{alertTitle}</CalloutTitle>
          <CalloutDescription>{alertDescription}</CalloutDescription>
        </CalloutContent>
      </Callout>
      {teamMembers.map((member) => (
        <TeamMemberOverviewCard key={member.id} member={member} />
      ))}
    </div>
  );
}
