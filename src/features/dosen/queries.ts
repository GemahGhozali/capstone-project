import "server-only";

import { Role } from "@/types";
import { prisma } from "@/libs/prisma";

export async function getAllDosen() {
  try {
    const allDosen = await prisma.dosen.findMany({
      select: {
        nip: true,
        status: true,
        prodi: {
          select: { nama: true },
        },
        user: {
          select: {
            id: true,
            namaLengkap: true,
            fotoProfil: true,
            userRoles: {
              select: {
                role: { select: { nama: true } },
              },
            },
          },
        },
      },
    });

    return allDosen.map((dosen) => {
      const { user: account } = dosen;

      return {
        id: account.id,
        fotoProfil: account.fotoProfil,
        namaLengkap: account.namaLengkap,
        nip: dosen.nip,
        prodi: dosen.prodi.nama,
        roles: account.userRoles.map(({ role }) => role.nama) as Role[],
        status: dosen.status,
      };
    });
  } catch (error) {
    console.error("❌ Get Dosen By ID Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getDosenById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        namaLengkap: true,
        alamatEmail: true,
        fotoProfil: true,
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
