import { Badge } from "@/components/ui/badge";
import { getProposalById } from "../queries";
import { generateNameInitials } from "@/utils/generate-name-initials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProposalTeamMembersProps {
  team: NonNullable<Awaited<ReturnType<typeof getProposalById>>>["tim"];
}

export function ProposalTeamMembers({ team }: ProposalTeamMembersProps) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="p-6">
        <CardTitle>Anggota Tim</CardTitle>
        <CardDescription>{team.nama}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="rounded-lg border divide-y">
          {team.anggotaTim.map((member) => (
            <div key={member.nim} className="p-4 flex items-center gap-3 relative">
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
