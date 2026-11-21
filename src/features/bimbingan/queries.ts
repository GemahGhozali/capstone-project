import "server-only";

import { prisma } from "@/libs/prisma";
import { requireRole } from "@/libs/dal";

export async function getListBimbinganMahasiswa() {
  const { userId: mahasiswaId } = await requireRole("Mahasiswa");

  try {
    return prisma.bimbingan.findMany({
      where: { mahasiswaId },
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
    });
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
      status: bimbingan.status,
      mahasiswa: {
        nim: bimbingan.mahasiswa.nim,
        namaLengkap: bimbingan.mahasiswa.user.namaLengkap,
      },
    }));
  } catch (error) {
    console.error("❌ Get List Bimbingan Dosen Pembimbing Error :", error);
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
          },
        },
        resume: {
          select: {
            subjudul: true,
          },
        },
        dosen: {
          select: {
            nip: true,
            user: {
              select: {
                namaLengkap: true,
              },
            },
          },
        },
        bimbingan: {
          orderBy: { tanggal: "desc" },
          select: {
            id: true,
            tanggal: true,
            catatan: true,
            filePath: true,
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
      dosenPembimbing: mahasiswa.dosen?.user.namaLengkap,
      subjudulResume: mahasiswa.resume?.subjudul,
      bimbingan: {
        list: mahasiswa.bimbingan,
        total: { ...totalBimbingan, keseluruhan: mahasiswa.bimbingan.length },
      },
    };
  } catch (error) {
    console.error("❌ Get Mahasiswa With Bimbingan List Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}
