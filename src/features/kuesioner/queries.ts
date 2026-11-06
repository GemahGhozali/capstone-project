import "server-only";

import { prisma } from "@/libs/prisma";

export async function getAllKuesioner() {
  try {
    const kuesionerList = await prisma.kuesioner.findMany({
      select: {
        id: true,
        judul: true,
        deskripsi: true,
        periode: true,
        status: true,
        _count: {
          select: {
            respon: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return kuesionerList.map((kuesioner) => ({
      id: kuesioner.id,
      judul: kuesioner.judul,
      deskripsi: kuesioner.deskripsi,
      periode: kuesioner.periode,
      status: kuesioner.status,
      totalRespon: kuesioner._count.respon,
    }));
  } catch (error) {
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getKuesionerById(id: string) {
  try {
    return prisma.kuesioner.findUnique({
      where: { id },
      select: {
        id: true,
        judul: true,
        deskripsi: true,
        periode: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        bagian: {
          orderBy: { urutan: "asc" },
          select: {
            id: true,
            judul: true,
            urutan: true,
            pertanyaan: {
              orderBy: { urutan: "asc" },
              select: {
                id: true,
                teks: true,
                tipe: true,
                wajib: true,
                urutan: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    throw new Error("Terjadi kesalahan pada server!");
  }
}
