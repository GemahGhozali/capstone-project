import "server-only";

import { prisma } from "@/libs/prisma";

export async function getDosenById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        namaLengkap: true,
        alamatEmail: true,
        identifier: true,
        fotoProfil: true,
        isActive: true,
        userRoles: {
          select: {
            role: {
              select: { id: true, nama: true },
            },
          },
        },
        dosen: {
          select: {
            nip: true,
            bidangKeahlian: true,
            status: true,
            prodi: {
              select: {
                id: true,
                nama: true,
              },
            },
            dosenPembimbingDetail: {
              select: {
                status: true,
                batasBimbingan: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.dosen) return null;

    const { dosen } = user;

    return {
      id,
      fotoProfil: user.fotoProfil,
      namaLengkap: user.namaLengkap,
      nip: dosen.nip,
      bidangKeahlian: dosen.bidangKeahlian,
      status: dosen.status,
      prodi: dosen.prodi,
      alamatEmail: user.alamatEmail,
      roles: user.userRoles.map(({ role }) => role),
      kuotaBimbingan: dosen.dosenPembimbingDetail?.batasBimbingan ?? 10,
      statusBimbingan: dosen.dosenPembimbingDetail?.status ?? "Buka",
    };
  } catch (error) {
    console.error("❌ Get Dosen By ID Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getAllDosenRoles() {
  try {
    return prisma.role.findMany({
      select: { id: true, nama: true },
      where: { nama: { not: "Mahasiswa" } },
    });
  } catch (error) {
    throw new Error("Terjadi kesalahan pada server!");
  }
}
