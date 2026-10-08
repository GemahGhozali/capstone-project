import "server-only";

import { prisma } from "@/libs/prisma";

export async function getAllProposal() {
  try {
    const allProposal = await prisma.proposal.findMany({
      select: {
        id: true,
        judul: true,
        status: true,
        createdAt: true,
        tim: {
          select: {
            nama: true,
          },
        },
      },
    });

    return allProposal.map((proposal) => ({
      id: proposal.id,
      judul: proposal.judul,
      status: proposal.status,
      namaTim: proposal.tim.nama,
      tanggalPengajuan: proposal.createdAt,
    }));
  } catch (error) {
    console.error("❌ Get All Proposal Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getProposalById(id: string) {
  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      select: {
        id: true,
        file: true,
        judul: true,
        mitra: true,
        status: true,
        createdAt: true,
        reviews: {
          select: {
            id: true,
            status: true,
            catatan: true,
            createdAt: true,
            dosen: {
              select: {
                user: {
                  select: {
                    namaLengkap: true,
                    fotoProfil: true,
                  },
                },
              },
            },
          },
        },
        tim: {
          select: {
            nama: true,
            anggotaTim: {
              select: {
                kategoriCapstone: true,
                peran: true,
                mahasiswa: {
                  select: {
                    nim: true,
                    user: {
                      select: {
                        namaLengkap: true,
                        fotoProfil: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!proposal) return null;

    return {
      id: proposal.id,
      file: proposal.file,
      judul: proposal.judul,
      mitra: proposal.mitra,
      status: proposal.status,
      tim: {
        nama: proposal.tim.nama,
        anggotaTim: proposal.tim.anggotaTim.map((anggota) => ({
          nim: anggota.mahasiswa.nim,
          namaLengkap: anggota.mahasiswa.user.namaLengkap,
          fotoProfil: anggota.mahasiswa.user.fotoProfil,
          kategoriCapstone: anggota.kategoriCapstone,
          peran: anggota.peran,
        })),
      },
      reviews: proposal.reviews.map((review) => ({
        id: review.id,
        status: review.status,
        catatan: review.catatan,
        namaDosenReviewer: review.dosen?.user.namaLengkap,
        tanggalReview: review.createdAt,
      })),
    };
  } catch (error) {
    console.error("❌ Get Proposal By Id Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}
