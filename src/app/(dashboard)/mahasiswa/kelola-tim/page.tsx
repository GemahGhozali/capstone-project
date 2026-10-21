import { TimForm } from "@/features/tim/components/tim-form";
import { TeamOverview } from "@/features/tim/components/team-overview";
import { TeamInvitationCallout } from "@/features/tim/components/team-invitation-callout";
import { getMahasiswaTeamManagementData } from "@/features/tim/queries";

export default async function KelolaTimPage() {
  const { hasTeam, isInvited, isKetua, statusProposal, tim } = await getMahasiswaTeamManagementData();

  const teamIsLocked = !isKetua || statusProposal === "Menunggu" || statusProposal === "Disetujui";

  const mahasiswaIsInvited = hasTeam && isInvited;
  const mahasiswaNotAllowedToChangeTeam = hasTeam && teamIsLocked;

  if (mahasiswaIsInvited) {
    return <TeamInvitationCallout teamMembers={tim.anggota} teamName={tim.nama} />;
  }

  if (mahasiswaNotAllowedToChangeTeam) {
    return <TeamOverview teamMembers={tim.anggota} teamName={tim.nama} statusProposal={statusProposal} />;
  }

  return <TimForm teamData={tim} />;
}
