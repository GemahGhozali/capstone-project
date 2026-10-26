import { getAllProposal, getMahasiswaProposalManagementData } from "./queries";

export type ProposalListItem = Awaited<ReturnType<typeof getAllProposal>>[number];
export type ProposalManagementData = Awaited<ReturnType<typeof getMahasiswaProposalManagementData>>["proposal"];
