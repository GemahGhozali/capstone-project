import "server-only";

import { prisma } from "@/libs/prisma";
import { userIsValidAndHasRole } from "@/libs/dal";

export async function getDosenById(id: string) {
  try {
    await userIsValidAndHasRole("Kaprodi");

    const dosen = await prisma.dosen.findUnique({
      where: { id },
      select: {
        status: true,
        prodiId: true,
        bidangKeahlian: true,
        user: {
          select: {
            id: true,
            namaLengkap: true,
            alamatEmail: true,
            identifier: true,
            fotoProfil: true,
            isActive: true,
            userRoles: {
              select: {
                roleId: true,
              },
            },
          },
        },
        dosenPembimbingDetail: {
          select: {
            status: true,
            batasBimbingan: true,
          },
        },
      },
    });

    if (!dosen || !dosen.user) return null;

    return {
      id,
      namaLengkap: dosen.user.namaLengkap,
      alamatEmail: dosen.user.alamatEmail,
      nip: dosen.user.identifier,
      password: "",
      bidangKeahlian: dosen.bidangKeahlian,
      fotoProfil: dosen.user.fotoProfil,
      status: dosen.status,
      prodiId: dosen.prodiId,
      roleId: dosen.user.userRoles.map((userRole) => userRole.roleId),
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
