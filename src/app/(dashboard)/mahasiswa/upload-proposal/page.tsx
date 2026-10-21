import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProposalForm } from "@/features/proposal/components/proposal-form";
import { IconInfoCircle } from "@tabler/icons-react";
import { ProposalReviews } from "@/features/proposal/components/proposal-reviews";
import { ProposalOverview } from "@/features/proposal/components/proposal-overview";
import { ProposalStatusCallout } from "@/features/proposal/components/proposal-status-callout";
import { getMahasiswaProposalManagementData } from "@/features/proposal/queries";
import { Callout, CalloutIcon, CalloutContent, CalloutTitle, CalloutDescription, CalloutAction } from "@/components/ui/callout";

export default async function UploadProposalPage() {
  const { hasTeam, isKetua, isTeamComplete, proposal } = await getMahasiswaProposalManagementData();

  const mahasiswaHasNoTeam = !hasTeam;
  const mahasiswaHasNoAccessToProposal = !isKetua && !proposal;
  const mahasiswaIsLeaderWithUnconfirmedMembers = isKetua && !isTeamComplete;

  if (mahasiswaHasNoTeam) {
    return (
      <Callout>
        <CalloutIcon className="bg-blue-500/15 text-blue-500">
          <IconInfoCircle />
        </CalloutIcon>
        <CalloutContent>
          <CalloutTitle>Anda Belum Memiliki Tim!</CalloutTitle>
          <CalloutDescription>Silahkan bentuk tim Capstone Project anda terlebih dahulu</CalloutDescription>
        </CalloutContent>
        <CalloutAction
          render={
            <Link href="/mahasiswa/kelola-tim" className="w-full">
              <Button className="w-full">Buat Tim</Button>
            </Link>
          }
        />
      </Callout>
    );
  }

  if (mahasiswaHasNoAccessToProposal) {
    return (
      <Callout>
        <CalloutIcon className="bg-blue-500/15 text-blue-500">
          <IconInfoCircle />
        </CalloutIcon>
        <CalloutContent>
          <CalloutTitle>Anda Tidak Bisa Upload Proposal!</CalloutTitle>
          <CalloutDescription>Hanya ketua tim yang diperbolehkan untuk upload proposal</CalloutDescription>
        </CalloutContent>
      </Callout>
    );
  }

  if (mahasiswaIsLeaderWithUnconfirmedMembers) {
    return (
      <Callout>
        <CalloutIcon className="bg-blue-500/15 text-blue-500">
          <IconInfoCircle />
        </CalloutIcon>
        <CalloutContent>
          <CalloutTitle>Anda Belum Bisa Upload Proposal!</CalloutTitle>
          <CalloutDescription>Masih menunggu persetujuan anggota tim anda yang lain</CalloutDescription>
        </CalloutContent>
      </Callout>
    );
  }

  if (!proposal) {
    return <ProposalForm proposal={proposal} />;
  }

  const showOverview = !isKetua || proposal.status === "Disetujui";

  return (
    <div className="space-y-6">
      <ProposalStatusCallout proposalStatus={proposal.status} />
      <ProposalReviews reviews={proposal.reviews} />
      {showOverview ? <ProposalOverview proposal={proposal} /> : <ProposalForm proposal={proposal} />}
    </div>
  );
}
