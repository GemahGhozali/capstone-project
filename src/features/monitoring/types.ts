import {
  getAllBimbinganMahasiswaMonitoring,
  getDosenPembimbingDashboardOverview,
  getKaprodiDashboardOverview,
  getAllMahasiswaCapstoneProjectProgress,
  getDosenCapstoneProjectDashboardOverview,
} from "./queries";

import { StatusProposal, StatusResume } from "@/generated/prisma/enums";

export type DosenCapstoneProjectDashboard = Awaited<ReturnType<typeof getDosenCapstoneProjectDashboardOverview>>;
export type DosenPembimbingDashboard = Awaited<ReturnType<typeof getDosenPembimbingDashboardOverview>>;
export type KaprodiDashboard = Awaited<ReturnType<typeof getKaprodiDashboardOverview>>;
export type CapstoneProjectMonitoring = Awaited<ReturnType<typeof getAllMahasiswaCapstoneProjectProgress>>[number];
export type BimbinganMahasiswaMonitoring = Awaited<ReturnType<typeof getAllBimbinganMahasiswaMonitoring>>[number];

export type CapstoneProjectProgress = {
  statusTim: "Menunggu Persetujuan" | "Lengkap" | "Tidak Ada";
  statusProposal: StatusProposal | "Tidak Ada";
  statusResume: StatusResume | "Tidak Ada";
};
