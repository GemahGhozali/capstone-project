import { ProposalTable } from "@/features/proposal/components/proposal-table";
import { getAllProposal } from "@/features/proposal/queries";

export default async function DaftarProposalPage() {
  const proposal = await getAllProposal();

  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Daftar Proposal</h1>
        <p className="text-muted-foreground text-sm">Daftar proposal dari tim capstone project.</p>
      </div>
      <ProposalTable data={proposal} />
    </div>
  );
}
