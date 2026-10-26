import { notFound } from "next/navigation";
import { getProposalById } from "@/features/proposal/queries";
import { ProposalReviews } from "@/features/proposal/components/proposal-reviews";
import { ProposalOverview } from "@/features/proposal/components/proposal-overview";
import { ProposalTeamMembers } from "@/features/proposal/components/proposal-team-members";
import { ProposalStatusCallout } from "@/features/proposal/components/proposal-status-callout";

type ProposalDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProposalDetailPage({ params }: ProposalDetailPageProps) {
  const { id } = await params;

  const proposal = await getProposalById(id);

  if (!proposal) notFound();

  return (
    <div className="space-y-6">
      <ProposalStatusCallout currentProposalStatus={proposal.status} viewer="Dosen" />
      <ProposalReviews reviews={proposal.reviews} viewer="Dosen" currentProposalStatus={proposal.status} />
      <ProposalOverview proposal={proposal} />
      <ProposalTeamMembers team={proposal.tim} />
    </div>
  );
}
