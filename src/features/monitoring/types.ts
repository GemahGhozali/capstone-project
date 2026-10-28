import { StatusProposal, StatusResume } from "@/generated/prisma/enums";
import { getProposalMonitoringOverview } from "./queries";

export type ProposalMonitoring = Awaited<ReturnType<typeof getProposalMonitoringOverview>>;

export type CapstoneProjectProgress = {
  statusTim: "Menunggu Persetujuan" | "Lengkap" | "Tidak Ada";
  statusProposal: StatusProposal | "Tidak Ada";
  statusResume: StatusResume | "Tidak Ada";
};
