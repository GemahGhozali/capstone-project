import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { StatusProposal } from "@/generated/prisma/enums";
import { TeamMemberInput } from "../schemas";
import { generateNameInitials } from "@/utils/generate-name-initials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconCircleCheck, IconInfoCircle, IconLock, IconNut } from "@tabler/icons-react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
      <Card className="p-0">
        <CardHeader className="p-6 flex items-center flex-col gap-3 lg:flex-row">
          <div
            className={cn(
              "size-12 grid place-content-center rounded-full shrink-0 bg-blue-500/15 text-blue-500",
              proposalApproved && "bg-green-500/15 text-green-500",
              proposalUploaded && "bg-yellow-500/15 text-yellow-500",
            )}
          >
            {proposalApproved ? <IconCircleCheck /> : proposalUploaded ? <IconLock /> : <IconInfoCircle />}
          </div>
          <div className="text-center lg:text-left">
            <CardTitle>{alertTitle}</CardTitle>
            <CardDescription>{alertDescription}</CardDescription>
          </div>
        </CardHeader>
      </Card>
      {teamMembers.map((member) => (
        <Card key={member.id} className="p-0 gap-0 divide-y">
          <CardHeader className="p-4 flex items-center gap-3 relative">
            <div className="flex gap-3 md:items-center max-md:flex-col">
              <Avatar size="lg">
                <AvatarImage src={member.fotoProfil ?? ""} alt={member.namaLengkap} />
                <AvatarFallback>{generateNameInitials(member.namaLengkap)}</AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <p className="line-clamp-1 text-sm font-medium">{member.namaLengkap}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {member.peran} - {member.nim}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="h-6 ml-auto max-md:absolute max-md:top-4 max-md:right-4">
              {member.kategoriCapstone}
            </Badge>
          </CardHeader>
          <CardFooter className="p-4! border-t justify-between">
            <p className="text-sm flex items-center gap-1.5 text-muted-foreground">
              <IconNut className="size-4" /> Persetujuan :
            </p>
            <Badge
              className={cn(
                member.statusPersetujuan === "Menunggu" && "text-yellow-500 bg-yellow-500/15",
                member.statusPersetujuan === "Disetujui" && "text-green-500 bg-green-500/15",
              )}
            >
              {member.statusPersetujuan}
            </Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
