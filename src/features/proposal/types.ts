import { getAllProposal, getMahasiswaProposalManagementData } from "./queries";

export type ProposalViewer = "Dosen" | "Kaprodi" | "Mahasiswa";
export type ProposalListItem = Awaited<ReturnType<typeof getAllProposal>>[number];
export type ProposalManagementData = Awaited<ReturnType<typeof getMahasiswaProposalManagementData>>["proposal"];
