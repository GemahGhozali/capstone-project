import "server-only";

import { prisma } from "@/libs/prisma";
import { requireRole } from "@/libs/dal";

export async function getMahasiswaBimbinganManagementData() {
  const { userId: mahasiswaId } = await requireRole("Mahasiswa");

  try {
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      select: {
        dosen: {
          select: {
            nip: true,
            user: {
              select: {
                namaLengkap: true,
                fotoProfil: true,
              },
            },
          },
        },
        resume: {
          select: {
            subjudul: true,
            status: true,
          },
        },
        bimbingan: {
          orderBy: { tanggal: "desc" },
          select: {
            id: true,
            tanggal: true,
            catatan: true,
            filePath: true,
            fileName: true,
            fileSize: true,
            status: true,
          },
        },
      },
    });

    if (!mahasiswa?.resume || !mahasiswa.dosen || !mahasiswa.bimbingan) {
      return { resume: null, dosen: null, bimbingan: [] };
    }

    return {
      resume: {
        status: mahasiswa.resume.status,
        subjudul: mahasiswa.resume.subjudul,
      },
      dosen: {
        nip: mahasiswa.dosen.nip,
        fotoProfil: mahasiswa.dosen.user.fotoProfil,
        namaLengkap: mahasiswa.dosen.user.namaLengkap,
      },
      bimbingan: mahasiswa.bimbingan,
    };
  } catch (error) {
    console.error("❌ Get Mahasiswa Bimbingan Management Data Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getListBimbinganDosenPembimbing() {
  const { userId: dosenId } = await requireRole("Dosen Pembimbing");

  try {
    const bimbinganList = await prisma.bimbingan.findMany({
      where: { dosenId },
      orderBy: { tanggal: "desc" },
      select: {
        id: true,
        tanggal: true,
        catatan: true,
        filePath: true,
        fileName: true,
        fileSize: true,
        status: true,
        mahasiswa: {
          select: {
            nim: true,
            user: {
              select: {
                namaLengkap: true,
              },
            },
          },
        },
      },
    });

    return bimbinganList.map((bimbingan) => ({
      id: bimbingan.id,
      tanggal: bimbingan.tanggal,
      catatan: bimbingan.catatan,
      filePath: bimbingan.filePath,
      fileName: bimbingan.fileName,
      fileSize: bimbingan.fileSize,
      status: bimbingan.status,
      mahasiswa: {
        nim: bimbingan.mahasiswa.nim,
        namaLengkap: bimbingan.mahasiswa.user.namaLengkap,
      },
    }));
  } catch (error) {
    console.error("❌ Get Dosen Bimbingan Data Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getMahasiswaWithBimbinganList(mahasiswaId: string) {
  await requireRole("Kaprodi");

  try {
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      select: {
        id: true,
        nim: true,
        user: {
          select: {
            namaLengkap: true,
            fotoProfil: true,
          },
        },
        kelas: {
          select: {
            nama: true,
            angkatan: true,
          },
        },
        resume: {
          select: {
            subjudul: true,
            status: true,
          },
        },
        dosen: {
          select: {
            nip: true,
            user: {
              select: {
                namaLengkap: true,
                fotoProfil: true,
              },
            },
          },
        },
        bimbingan: {
          orderBy: [{ tanggal: "desc" }, { createdAt: "desc" }],
          select: {
            id: true,
            tanggal: true,
            catatan: true,
            filePath: true,
            fileName: true,
            fileSize: true,
            status: true,
          },
        },
      },
    });

    if (!mahasiswa) return null;

    const totalBimbingan = mahasiswa.bimbingan.reduce(
      (acc, bimbingan) => {
        if (bimbingan.status === "Menunggu") acc.menunggu += 1;
        if (bimbingan.status === "Ditolak") acc.ditolak += 1;
        if (bimbingan.status === "Disetujui") acc.disetujui += 1;

        return acc;
      },
      { menunggu: 0, disetujui: 0, ditolak: 0 },
    );

    return {
      id: mahasiswa.id,
      nim: mahasiswa.nim,
      namaLengkap: mahasiswa.user.namaLengkap,
      fotoProfil: mahasiswa.user.fotoProfil,
      kelas: mahasiswa.kelas,
      resume: {
        status: mahasiswa.resume?.status,
        subjudul: mahasiswa.resume?.subjudul,
      },
      dosen: {
        dosenPembimbing: mahasiswa.dosen?.user.namaLengkap ?? "Belum ditentukan",
        dosenNip: mahasiswa.dosen?.nip ?? "-",
        dosenFotoProfil: mahasiswa.dosen?.user.fotoProfil ?? null,
      },
      bimbingan: {
        total: totalBimbingan,
        list: mahasiswa.bimbingan,
      },
    };
  } catch (error) {
    console.error("❌ Get Kaprodi Bimbingan Detail Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}
