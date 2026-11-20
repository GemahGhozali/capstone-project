import "server-only";

import { prisma } from "@/libs/prisma";
import { requireRole } from "@/libs/dal";
import { StatusProposal } from "@/generated/prisma/enums";
import { CapstoneProjectProgress } from "./types";

export async function getDosenCapstoneProjectDashboardOverview() {
  await requireRole("Dosen Capstone Project");

  try {
    const [proposalGroups, totalProposal, totalTim, proposalTerbaru] = await prisma.$transaction([
      prisma.proposal.groupBy({
        by: ["status"],
        orderBy: { status: "asc" },
        where: { status: { not: "Arsip" } },
        _count: { _all: true },
      }),

      prisma.proposal.count({
        where: { status: { not: "Arsip" } },
      }),

      prisma.tim.count({
        where: {
          OR: [{ proposal: { is: null } }, { proposal: { status: { not: "Arsip" } } }],
        },
      }),

      prisma.proposal.findMany({
        where: { status: { not: "Arsip" } },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          judul: true,
          status: true,
          tim: { select: { nama: true } },
        },
      }),
    ]);

    const proposalTotalByStatus: Record<StatusProposal, number> = {
      Menunggu: 0,
      Revisi: 0,
      Ditolak: 0,
      Disetujui: 0,
      Arsip: 0,
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
        arsip: proposalTotalByStatus.Arsip,
      },
      proposalTerbaru: proposalTerbaru.map(({ tim, ...proposal }) => ({
        id: proposal.id,
        judul: proposal.judul,
        status: proposal.status,
        namaTim: tim.nama,
      })),
    };
  } catch (error) {
    console.error("❌ Get Proposal Monitoring Overview Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getDosenPembimbingDashboardOverview() {
  const { userId: dosenId } = await requireRole("Dosen Pembimbing");

  try {
    const [bimbinganMenunggu, resumeTerbaru, totalMahasiswaDisetujui, totalResumeMenunggu] = await prisma.$transaction([
      prisma.bimbingan.findMany({
        where: { dosenId, status: "Menunggu" },
        orderBy: { tanggal: "desc" },
        take: 5,
        select: {
          id: true,
          tanggal: true,
          catatan: true,
          filePath: true,
          status: true,
          mahasiswa: {
            select: {
              nim: true,
              user: { select: { namaLengkap: true } },
            },
          },
        },
      }),

      prisma.resume.findMany({
        where: { dosenId, status: { not: "Arsip" } },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          subjudul: true,
          status: true,
          mahasiswa: {
            select: {
              nim: true,
              user: { select: { namaLengkap: true } },
            },
          },
        },
      }),

      prisma.resume.count({ where: { dosenId, status: "Disetujui" } }),

      prisma.resume.count({ where: { dosenId, status: "Menunggu" } }),
    ]);

    return {
      totalResumeMenunggu,
      totalMahasiswaDisetujui,
      totalBimbinganMenunggu: bimbinganMenunggu.length,
      bimbinganMenunggu: bimbinganMenunggu.map((bimbingan) => ({
        id: bimbingan.id,
        catatan: bimbingan.catatan,
        tanggal: bimbingan.tanggal,
        filePath: bimbingan.filePath,
        status: bimbingan.status,
        mahasiswa: bimbingan.mahasiswa.user.namaLengkap,
      })),
      resumeTerbaru: resumeTerbaru.map((resume) => ({
        id: resume.id,
        subjudul: resume.subjudul,
        status: resume.status,
        mahasiswa: {
          nim: resume.mahasiswa.nim,
          namaLengkap: resume.mahasiswa.user.namaLengkap,
        },
      })),
    };
  } catch (error) {
    console.error("❌ Get Dosen Pembimbing Dashboard Overview Error :", error);
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

export async function getAllMahasiswaCapstoneProjectProgress() {
  await requireRole("Kaprodi");

  try {
    const mahasiswaList = await prisma.mahasiswa.findMany({
      orderBy: { nim: "asc" },
      where: {
        status: "Aktif",
        user: { isActive: true },
      },
      select: {
        id: true,
        nim: true,
        user: {
          select: {
            namaLengkap: true,
          },
        },
        kelas: {
          select: {
            nama: true,
            angkatan: true,
          },
        },
        dosen: {
          select: {
            user: {
              select: {
                namaLengkap: true,
              },
            },
          },
        },
        anggotaTim: {
          select: {
            tim: {
              select: {
                id: true,
                proposal: { select: { id: true, status: true } },
              },
            },
          },
        },
        resume: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    return mahasiswaList.map((mahasiswa) => {
      const anggotaTim = mahasiswa.anggotaTim;
      const tim = anggotaTim?.tim && { id: anggotaTim.tim.id };
      const proposal = mahasiswa?.anggotaTim?.tim?.proposal;
      const resume = mahasiswa.resume;

      return {
        id: mahasiswa.id,
        namaLengkap: mahasiswa.user.namaLengkap,
        nim: mahasiswa.nim,
        dosenPembimbing: mahasiswa?.dosen?.user?.namaLengkap,
        tim,
        proposal,
        resume,
        kelas: {
          nama: mahasiswa.kelas.nama,
          angkatan: mahasiswa.kelas.angkatan,
        },
      };
    });
  } catch (error) {
    console.error("❌ Get All Mahasiswa Capstone Project Progress Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getAllBimbinganMahasiswaMonitoring() {
  await requireRole("Kaprodi");

  try {
    const mahasiswaList = await prisma.mahasiswa.findMany({
      orderBy: { nim: "asc" },
      where: {
        status: "Aktif",
        user: { isActive: true },
      },
      select: {
        id: true,
        nim: true,
        user: {
          select: {
            namaLengkap: true,
          },
        },
        resume: {
          select: {
            subjudul: true,
          },
        },
        dosen: {
          select: {
            user: {
              select: {
                namaLengkap: true,
              },
            },
          },
        },
        _count: {
          select: {
            bimbingan: {
              where: { status: "Disetujui" },
            },
          },
        },
      },
    });

    return mahasiswaList.map((mahasiswa) => ({
      id: mahasiswa.id,
      namaLengkap: mahasiswa.user.namaLengkap,
      nim: mahasiswa.nim,
      subjudul: mahasiswa.resume?.subjudul,
      dosenPembimbing: mahasiswa.dosen?.user.namaLengkap,
      totalBimbinganTerverifikasi: mahasiswa._count.bimbingan,
    }));
  } catch (error) {
    console.error("❌ Get All Bimbingan Mahasiswa Monitoring Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}
