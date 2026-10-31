import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { getTeamById } from "@/features/tim/queries";
import { id as localeId } from "date-fns/locale";
import { TeamMemberOverviewCard } from "@/features/tim/components/team-member-overview-card";

type TeamDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { id } = await params;

  const team = await getTeamById(id);

  if (!team) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <Badge className={cn("mb-2.5", team.status === "Lengkap" ? "bg-green-500/15 text-green-500" : "bg-blue-500/15 text-blue-500")}>
          Status Tim - {team.status}
        </Badge>
        <h1 className="font-semibold text-lg">{team.nama}</h1>
        <p className="text-muted-foreground text-sm">
          Dibentuk pada hari {format(team.tanggalPembuatan, "eeee, dd MMMM yyyy, hh:mm", { locale: localeId })}
        </p>
      </div>
      {team.anggota.map((member) => (
        <TeamMemberOverviewCard key={member.id} member={member} />
      ))}
    </div>
  );
}
