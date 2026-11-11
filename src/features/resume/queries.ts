import "server-only";

import { prisma } from "@/libs/prisma";
import { requireRole } from "@/libs/dal";

export async function getAllResume() {
  const session = await requireRole("Dosen Pembimbing", "Kaprodi");

  try {
    const isDosenPembimbing = session.currentRole === "Dosen Pembimbing";

    const allResume = await prisma.resume.findMany({
      where: { ...(isDosenPembimbing && { dosenId: session.userId }) },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        createdAt: true,
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
        dosen: {
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
      status: resume.status,
      namaMahasiswa: resume.mahasiswa.user.namaLengkap,
      nim: resume.mahasiswa.nim,
      fotoProfil: resume.mahasiswa.user.fotoProfil,
      tanggalPengajuan: resume.createdAt,
      dosenPembimbing: resume.dosen?.user.namaLengkap,
    }));
  } catch (error) {
    console.error("❌ Get All Resume Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getResumeById(id: string) {
  const session = await requireRole("Dosen Pembimbing", "Kaprodi");

  try {
    const isDosenPembimbing = session.currentRole === "Dosen Pembimbing";

    const resume = await prisma.resume.findUnique({
      where: {
        id,
        ...(isDosenPembimbing && { dosenId: session.userId }),
      },
      select: {
        id: true,
        filePath: true,
        fileName: true,
        fileSize: true,
        subjudul: true,
        status: true,

        // Informasi Dosen Pembimbing
        dosen: {
          select: {
            user: {
              select: {
                id: true,
                namaLengkap: true,
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
          orderBy: { createdAt: "desc" },
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
      filePath: resume.filePath,
      fileName: resume.fileName,
      fileSize: resume.fileSize,
      subjudul: resume.subjudul,
      status: resume.status,
      reviews: resume.reviews.map((review) => ({
        id: review.id,
        status: review.status,
        catatan: review.catatan,
        tanggal: review.createdAt,
        dosen: {
          namaLengkap: review.dosen?.user.namaLengkap ?? "Dosen Pembimbing",
          fotoProfil: review.dosen?.user.fotoProfil,
        },
      })),
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
        id: resume.dosen?.user?.id,
        namaLengkap: resume.dosen?.user.namaLengkap ?? "Dosen Pembimbing",
      },
    };
  } catch (error) {
    console.error("❌ Get Resume By Id Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getMahasiswaResumeManagementData() {
  const session = await requireRole("Mahasiswa");

  try {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where: { id: session.userId },
      select: {
        anggotaTim: {
          select: {
            tim: {
              select: {
                proposal: {
                  select: {
                    status: true,
                  },
                },
              },
            },
          },
        },
        resume: {
          select: {
            id: true,
            subjudul: true,
            filePath: true,
            fileName: true,
            fileSize: true,
            status: true,
            dosen: {
              select: {
                user: {
                  select: {
                    id: true,
                    namaLengkap: true,
                  },
                },
              },
            },
            reviews: {
              orderBy: { createdAt: "desc" },
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
        },
      },
    });

    const proposal = mahasiswa?.anggotaTim?.tim?.proposal;
    const resume = mahasiswa?.resume;

    return {
      proposal,
      resume: resume
        ? {
            id: resume.id,
            subjudul: resume.subjudul,
            filePath: resume.filePath,
            fileName: resume.fileName,
            fileSize: resume.fileSize,
            status: resume.status,
            reviews: resume.reviews.map((review) => ({
              id: review.id,
              status: review.status,
              catatan: review.catatan,
              tanggal: review.createdAt,
              dosen: {
                namaLengkap: review.dosen?.user.namaLengkap ?? "Dosen Pembimbing",
                fotoProfil: review.dosen?.user.fotoProfil,
              },
            })),
            dosen: {
              id: resume.dosen?.user?.id,
              namaLengkap: resume.dosen?.user?.namaLengkap ?? "Dosen Pembimbing",
            },
          }
        : undefined,
    };
  } catch (error) {
    console.log("❌ Get Mahasiswa Resume Management Data Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getAuthenticatedMahasiswaResume() {
  const { userId: mahasiswaId } = await requireRole("Mahasiswa");

  try {
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      select: { id: true, resume: { select: { status: true } } },
    });

    return mahasiswa?.resume;
  } catch (error) {
    console.log("❌ Get Eligibilitas Kuesioner Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}
