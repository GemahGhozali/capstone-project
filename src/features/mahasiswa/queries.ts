import "server-only";

import { prisma } from "@/libs/prisma";

export async function getAllMahasiswa() {
  try {
    const allMahasiswa = await prisma.mahasiswa.findMany({
      select: {
        nim: true,
        status: true,
        kelas: {
          select: { nama: true, angkatan: true },
        },
        user: {
          select: {
            id: true,
            namaLengkap: true,
            fotoProfil: true,
          },
        },
      },
    });

    return allMahasiswa.map((mahasiswa) => {
      const { user: account } = mahasiswa;

      return {
        id: account.id,
        fotoProfil: account.fotoProfil,
        namaLengkap: account.namaLengkap,
        nim: mahasiswa.nim,
        kelas: mahasiswa.kelas,
        status: mahasiswa.status,
      };
    });
  } catch (error) {
    console.error("❌ Get All Mahasiswa Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getMahasiswaById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        namaLengkap: true,
        alamatEmail: true,
        fotoProfil: true,
        mahasiswa: {
          select: {
            nim: true,
            status: true,
            tanggalMasuk: true,
            kelas: {
              select: {
                id: true,
                nama: true,
                angkatan: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.mahasiswa) return null;

    const { mahasiswa } = user;

    return {
      id,
      fotoProfil: user.fotoProfil,
      namaLengkap: user.namaLengkap,
      nim: mahasiswa.nim,
      kelas: mahasiswa.kelas,
      tanggalMasuk: mahasiswa.tanggalMasuk,
      status: mahasiswa.status,
      alamatEmail: user.alamatEmail,
    };
  } catch (error) {
    console.error("❌ Get Mahasiswa By ID Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}
