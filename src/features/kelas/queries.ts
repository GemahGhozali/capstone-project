import "server-only";

import { prisma } from "@/libs/prisma";

export async function getAllKelas() {
  const classList = await prisma.kelas.findMany({
    select: {
      id: true,
      nama: true,
      angkatan: true,
      _count: {
        select: {
          mahasiswa: true,
        },
      },
    },
  });

  return classList.map((kelas) => ({
    id: kelas.id,
    nama: kelas.nama,
    angkatan: kelas.angkatan,
    totalMahasiswa: kelas._count.mahasiswa,
  }));
}
