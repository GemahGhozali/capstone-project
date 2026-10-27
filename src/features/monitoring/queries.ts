import "server-only";

import { prisma } from "@/libs/prisma";
import { requireRole } from "@/libs/dal";
import { StatusProposal } from "@/generated/prisma/enums";

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
