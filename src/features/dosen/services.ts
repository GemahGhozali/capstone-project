import "server-only";

import { prisma } from "@/libs/prisma";

export async function validateDosenPembimbing(dosenId: string, options: { excludeResumeId?: string } = {}) {
  const { excludeResumeId } = options;

  const dosen = await prisma.dosen.findUnique({
    where: { id: dosenId },
    select: {
      status: true,
      user: {
        select: {
          isActive: true,
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
      _count: {
        select: {
          mahasiswaBimbingan: {
            where: { status: "Aktif" },
          },
          resumes: {
            where: {
              status: "Menunggu",
              mahasiswa: { status: "Aktif" },
              ...(excludeResumeId && { id: { not: excludeResumeId } }),
            },
          },
        },
      },
    },
  });

  if (!dosen) {
    return { isValid: false, message: "Dosen pembimbing tidak ditemukan!" };
  }

  if (dosen.status !== "Aktif" || !dosen.user.isActive) {
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

  const currentTotalBimbingan = dosen._count.mahasiswaBimbingan + dosen._count.resumes;
  const bimbinganQuotaIsFull = currentTotalBimbingan >= dosenPembimbingDetail.batasBimbingan;

  if (bimbinganQuotaIsFull) {
    return { isValid: false, message: "Kuota bimbingan dosen pembimbing yang anda pilih sudah penuh!" };
  }

  return { isValid: true, message: "Dosen pembimbing yang anda pilih valid!" };
}
