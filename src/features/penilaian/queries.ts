import "server-only";

import { prisma } from "@/libs/prisma";
import { requireRole } from "@/libs/dal";

export async function getAllPenilaianMahasiswa() {
  try {
    const mahasiswaList = await prisma.mahasiswa.findMany({
      where: { status: { in: ["Aktif", "Tuntas"] } },
      orderBy: { nim: "asc" },
      select: {
        id: true,
        nim: true,
        status: true,
        user: { select: { namaLengkap: true } },
        kelas: { select: { nama: true, angkatan: true } },
        penilaian: { select: { nilai: true } },
        responKuesioner: {
          where: { status: "Selesai" },
          take: 1,
          select: { id: true },
        },
      },
    });

    return mahasiswaList.map((mahasiswa) => {
      return {
        id: mahasiswa.id,
        nim: mahasiswa.nim,
        namaLengkap: mahasiswa.user.namaLengkap,
        kelas: mahasiswa.kelas,
        status: mahasiswa.status,
        nilai: mahasiswa.penilaian?.nilai ?? null,
        hasFilledKuesioner: mahasiswa.responKuesioner.length > 0,
      };
    });
  } catch (error) {
    console.log("❌ Get List Penilaian Mahasiswa Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getPenilaianAuthenticatedMahasiswa() {
  const { userId: mahasiswaId } = await requireRole("Mahasiswa");

  try {
    const [penilaian, responSelesai] = await Promise.all([
      prisma.penilaian.findUnique({
        where: { mahasiswaId },
        select: { nilai: true },
      }),
      prisma.responKuesioner.findFirst({
        where: { mahasiswaId, status: "Selesai" },
        select: { id: true },
      }),
    ]);

    return { nilai: penilaian?.nilai ?? null, hasFilledKuesioner: responSelesai !== null };
  } catch (error) {
    console.log("❌ Get Penilaian Mahasiswa Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}
