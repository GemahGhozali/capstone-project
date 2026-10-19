import { getMahasiswaProposalManagementData } from "./queries";

export type ProposalManagementData = Awaited<ReturnType<typeof getMahasiswaProposalManagementData>>["proposal"];
