import { StatusProposal, StatusResume } from "@/generated/prisma/enums";
import { getAllMahasiswaCapstoneProjectProgress, getAllBimbinganMahasiswaMonitoring, getProposalMonitoringOverview } from "./queries";

export type ProposalMonitoring = Awaited<ReturnType<typeof getProposalMonitoringOverview>>;
export type CapstoneProjectMonitoring = Awaited<ReturnType<typeof getAllMahasiswaCapstoneProjectProgress>>[number];
export type BimbinganMahasiswaMonitoring = Awaited<ReturnType<typeof getAllBimbinganMahasiswaMonitoring>>[number];

export type CapstoneProjectProgress = {
  statusTim: "Menunggu Persetujuan" | "Lengkap" | "Tidak Ada";
  statusProposal: StatusProposal | "Tidak Ada";
  statusResume: StatusResume | "Tidak Ada";
};
