import "server-only";

import { prisma } from "@/libs/prisma";
import { requireRole } from "@/libs/dal";
import { StatusProposal } from "@/generated/prisma/enums";
import { CapstoneProjectProgress } from "./types";

export async function getProposalMonitoringOverview() {
  await requireRole("Dosen Capstone Project");

  try {
    const [proposalGroups, totalProposal, totalTim, proposalTerbaru] = await prisma.$transaction([
      prisma.proposal.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.proposal.count(),
      prisma.tim.count(),
      prisma.proposal.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          status: true,
          createdAt: true,
          tim: { select: { nama: true } },
        },
      }),
    ]);

    const proposalTotalByStatus: Record<StatusProposal, number> = {
      Menunggu: 0,
      Revisi: 0,
      Ditolak: 0,
      Disetujui: 0,
    };

    for (const proposal of proposalGroups) {
      proposalTotalByStatus[proposal.status] = proposal._count._all;
    }

    return {
      totalTim,
      totalProposal: {
        keseluruhan: totalProposal,
        menunggu: proposalTotalByStatus.Menunggu,
        revisi: proposalTotalByStatus.Revisi,
        ditolak: proposalTotalByStatus.Ditolak,
        disetujui: proposalTotalByStatus.Disetujui,
      },
      proposalTerbaru: proposalTerbaru.map(({ tim, ...proposal }) => ({
        id: proposal.id,
        namaTim: tim.nama,
        status: proposal.status,
        tanggalPengajuan: proposal.createdAt,
      })),
    };
  } catch (error) {
    console.error("❌ Get Proposal Monitoring Overview Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getMahasiswaCapstoneProjectProgress(mahasiswaId: string): Promise<CapstoneProjectProgress> {
  await requireRole("Mahasiswa", "Kaprodi");

  try {
    const mahasiswaProfile = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      select: {
        anggotaTim: {
          select: {
            tim: {
              select: {
                anggotaTim: {
                  select: { statusPersetujuan: true },
                },
                proposal: {
                  select: { status: true },
                },
              },
            },
          },
        },
        resume: {
          select: { status: true },
        },
      },
    });

    if (!mahasiswaProfile?.anggotaTim) {
      return { statusTim: "Tidak Ada", statusProposal: "Tidak Ada", statusResume: "Tidak Ada" };
    }

    const teamMahasiswa = mahasiswaProfile.anggotaTim.tim;

    const allTeamMembers = teamMahasiswa.anggotaTim;
    const isEveryMemberApproved = allTeamMembers.length >= 2 && allTeamMembers.every((member) => member.statusPersetujuan === "Disetujui");

    const statusTim = isEveryMemberApproved ? "Lengkap" : "Menunggu Persetujuan";

    const teamProposal = teamMahasiswa.proposal;
    const statusProposal = teamProposal ? teamProposal.status : "Tidak Ada";

    const studentResume = mahasiswaProfile.resume;
    const statusResume = studentResume ? studentResume.status : "Tidak Ada";

    return { statusTim, statusProposal, statusResume };
  } catch (error) {
    console.error("❌ Get Mahasiswa Capstone Project Progress Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}
