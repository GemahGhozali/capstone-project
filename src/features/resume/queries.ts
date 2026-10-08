import "server-only";

import { prisma } from "@/libs/prisma";

export async function getAllResume() {
  try {
    const allResume = await prisma.resume.findMany({
      select: {
        id: true,
        subjudul: true,
        status: true,
        createdAt: true,
        mahasiswa: {
          select: {
            user: {
              select: {
                namaLengkap: true,
              },
            },
          },
        },
      },
    });

    return allResume.map((resume) => ({
      id: resume.id,
      subjudul: resume.subjudul,
      status: resume.status,
      namaMahasiswa: resume.mahasiswa.user.namaLengkap,
      tanggalPengajuan: resume.createdAt,
    }));
  } catch (error) {
    console.error("❌ Get All Resume Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getResumeById(id: string) {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id },
      select: {
        id: true,
        file: true,
        subjudul: true,
        status: true,

        // Informasi Dosen Pembimbing
        dosen: {
          select: {
            id: true,
            nip: true,
            user: {
              select: {
                namaLengkap: true,
                fotoProfil: true,
              },
            },
          },
        },

        // Informasi Proposal
        proposal: {
          select: {
            judul: true,
            mitra: true,
          },
        },

        // Informasi Mahasiswa
        mahasiswa: {
          select: {
            nim: true,
            anggotaTim: {
              select: {
                kategoriCapstone: true,
              },
            },
            kelas: {
              select: {
                nama: true,
                angkatan: true,
              },
            },
            user: {
              select: {
                namaLengkap: true,
                fotoProfil: true,
              },
            },
          },
        },

        // List Riwayat Review
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
      },
    });

    if (!resume) return null;

    return {
      id: resume.id,
      file: resume.file,
      subjudul: resume.subjudul,
      status: resume.status,
      mahasiswa: {
        nim: resume.mahasiswa.nim,
        namaLengkap: resume.mahasiswa.user.namaLengkap,
        fotoProfil: resume.mahasiswa.user.fotoProfil,
        kelas: resume.mahasiswa.kelas,
        kategoriCapstone: resume.mahasiswa.anggotaTim?.kategoriCapstone!,
      },
      proposal: {
        judul: resume.proposal.judul,
        mitra: resume.proposal.mitra,
      },
      dosen: {
        id: resume.dosen?.id,
        nip: resume.dosen?.nip,
        namaLengkap: resume.dosen?.user.namaLengkap,
        fotoProfil: resume.dosen?.user.fotoProfil,
      },
      reviews: resume.reviews.map((review) => ({
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
