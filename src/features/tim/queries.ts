import "server-only";

import { prisma } from "@/libs/prisma";
import { StatusMahasiswa } from "@/generated/prisma/enums";

interface SearchInvitableMahasiswa {
  query: string;
  authenticatedMahasiswaId: string;
}

export async function searchInvitableMahasiswa({ query, authenticatedMahasiswaId }: SearchInvitableMahasiswa) {
  const foundedMahasiswa = await prisma.mahasiswa.findMany({
    take: 10,
    where: {
      status: StatusMahasiswa.Aktif,
      user: { isActive: true },
      anggotaTim: { is: null },
      id: { not: authenticatedMahasiswaId },
      OR: [{ nim: { contains: query, mode: "insensitive" } }, { user: { namaLengkap: { contains: query, mode: "insensitive" } } }],
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
    },
    orderBy: {
      user: {
        identifier: "asc",
      },
    },
  });

  return foundedMahasiswa.map((mahasiswa) => ({
    id: mahasiswa.id,
    identifier: mahasiswa.user.identifier,
    namaLengkap: mahasiswa.user.namaLengkap,
    fotoProfil: mahasiswa.user.fotoProfil,
  }));
}
