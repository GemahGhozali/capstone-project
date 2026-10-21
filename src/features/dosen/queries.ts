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

export async function getAllDosenPembimbing() {
  try {
    const dosenPembimbingList = await prisma.dosen.findMany({
      where: {
        status: "Aktif",
        dosenPembimbingDetail: { status: "Buka" },
        user: {
          isActive: true,
          userRoles: { some: { role: { nama: "Dosen Pembimbing" } } },
        },
      },
      select: {
        id: true,
        user: {
          select: {
            identifier: true,
            namaLengkap: true,
            fotoProfil: true,
          },
        },
        dosenPembimbingDetail: {
          select: {
            batasBimbingan: true,
          },
        },
        _count: {
          select: {
            mahasiswaBimbingan: {
              where: { status: "Aktif" },
            },
          },
        },
      },
      orderBy: { user: { namaLengkap: "asc" } },
    });

    return dosenPembimbingList
      .map((dosen) => {
        const { user, dosenPembimbingDetail, _count } = dosen;

        const batasBimbingan = dosenPembimbingDetail?.batasBimbingan ?? 0;
        const totalBimbingan = _count.mahasiswaBimbingan;
        const sisaKuota = Math.max(batasBimbingan - totalBimbingan, 0);

        return {
          id: dosen.id,
          nip: user.identifier,
          namaLengkap: user.namaLengkap,
          fotoProfil: user.fotoProfil,
          batasBimbingan,
          totalBimbingan,
          sisaKuota,
        };
      })
      .filter((dosen) => dosen.sisaKuota > 0);
  } catch (error) {
    console.error("❌ Get All Dosen Pembimbing Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}
