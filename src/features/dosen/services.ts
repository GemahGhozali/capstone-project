import "server-only";

import { prisma } from "@/libs/prisma";

export async function validateDosenPembimbing(dosenId: string) {
  const dosen = await prisma.dosen.findUnique({
    where: { id: dosenId },
    select: {
      status: true,
      user: {
        select: {
          userRoles: {
            select: {
              role: { select: { nama: true } },
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

  if (!dosen) {
    return { isValid: false, message: "Dosen pembimbing tidak ditemukan!" };
  }

  if (dosen.status !== "Aktif") {
    return { isValid: false, message: "Dosen pembimbing sedang tidak aktif!" };
  }

  const dosenPembimbingDetail = dosen.dosenPembimbingDetail;
  const hasDosenPembimbingRole = dosen.user.userRoles.some((userRole) => userRole.role.nama === "Dosen Pembimbing");
  const dosenIsNotValidDosenPembimbing = !hasDosenPembimbingRole || !dosenPembimbingDetail;

  if (dosenIsNotValidDosenPembimbing) {
    return { isValid: false, message: "Dosen yang anda pilih bukan seorang Dosen Pembimbing!" };
  }

  const statusBimbinganIsClosed = dosenPembimbingDetail.status === "Tutup";

  if (statusBimbinganIsClosed) {
    return { isValid: false, message: "Dosen pembimbing sedang tidak menerima bimbingan!" };
  }

  const currentTotalBimbingan = await prisma.mahasiswa.count({ where: { dosenId, status: "Aktif" } });
  const bimbinganQuotaIsFull = currentTotalBimbingan >= dosenPembimbingDetail.batasBimbingan;

  if (bimbinganQuotaIsFull) {
    return { isValid: false, message: "Kuota bimbingan dosen pembimbing yang anda pilih sudah penuh!" };
  }

  return { isValid: true, message: "Dosen pembimbing yang anda pilih valid!" };
}
