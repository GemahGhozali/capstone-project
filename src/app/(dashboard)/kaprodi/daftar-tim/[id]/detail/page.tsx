import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { getTeamById } from "@/features/tim/queries";
import { teamStatusStyles } from "@/features/tim/utils";
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
        <Badge className={cn("mb-2.5", teamStatusStyles[team.status])}>Status Tim - {team.status}</Badge>
        <h1 className="font-semibold text-lg">{team.nama}</h1>
        <p className="text-muted-foreground text-sm">
          {team.statusKelengkapan === "Lengkap"
            ? "Semua anggota telah mengonfirmasi keikutsertaannya."
            : "Beberapa anggota belum mengonfirmasi keikutsertaannya."}
        </p>
      </div>
      {team.anggota.map((member) => (
        <TeamMemberOverviewCard key={member.id} member={member} />
      ))}
    </div>
  );
}
