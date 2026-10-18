import "server-only";

import { prisma } from "@/libs/prisma";
import { userIsValidAndHasRole } from "@/libs/dal";
import { getAuthenticatedUserData } from "../auth/queries";
import { KategoriCapstone, PeranAnggotaTim, StatusMahasiswa, StatusPersetujuan } from "@/generated/prisma/enums";

interface SearchInvitableMahasiswa {
  query: string;
  authenticatedMahasiswaId: string;
}

export async function searchInvitableMahasiswa({ query, authenticatedMahasiswaId }: SearchInvitableMahasiswa) {
  const mahasiswaMembership = await prisma.anggotaTim.findUnique({
    where: { mahasiswaId: authenticatedMahasiswaId },
    select: { timId: true },
  });

  const mahasiswaTeamId = mahasiswaMembership?.timId;

  const invitableTeamFilter = mahasiswaTeamId
    ? { OR: [{ anggotaTim: { is: null } }, { anggotaTim: { is: { timId: mahasiswaTeamId } } }] }
    : { anggotaTim: { is: null } };

  const foundedMahasiswa = await prisma.mahasiswa.findMany({
    take: 5,
    where: {
      user: { isActive: true },
      status: StatusMahasiswa.Aktif,
      id: { not: authenticatedMahasiswaId },
      AND: [
        invitableTeamFilter,
        {
          OR: [
            {
              nim: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              user: {
                namaLengkap: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
      ],
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

export async function getMahasiswaTeamManagementData() {
  try {
    await userIsValidAndHasRole("Mahasiswa");

    const mahasiswa = await getAuthenticatedUserData();

    const mahasiswaMembership = await prisma.anggotaTim.findUnique({
      where: { mahasiswaId: mahasiswa.id },
      select: {
        peran: true,
        kategoriCapstone: true,
        statusPersetujuan: true,
        tim: {
          select: {
            id: true,
            nama: true,
            anggotaTim: {
              orderBy: [{ peran: "asc" }, { mahasiswa: { nim: "asc" } }],
              select: {
                peran: true,
                kategoriCapstone: true,
                statusPersetujuan: true,
                mahasiswa: {
                  select: {
                    id: true,
                    nim: true,
                    user: {
                      select: { namaLengkap: true, fotoProfil: true },
                    },
                  },
                },
              },
            },
            proposal: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    if (!mahasiswaMembership) {
      return {
        hasTeam: false as const,
        isKetua: true,
        isInvited: false,
        statusProposal: "Tidak Ada" as const,
        tim: {
          id: undefined,
          nama: undefined,
          anggota: [
            {
              id: mahasiswa.id,
              nim: mahasiswa.identifier,
              namaLengkap: mahasiswa.namaLengkap,
              fotoProfil: mahasiswa.fotoProfil,
              peran: PeranAnggotaTim.Ketua,
              kategoriCapstone: KategoriCapstone.EPD,
              statusPersetujuan: StatusPersetujuan.Disetujui,
              isCurrentLoginUser: true,
            },
          ],
        },
      };
    }

    const team = mahasiswaMembership.tim;

    const isKetua = mahasiswaMembership.peran === "Ketua";
    const statusProposal = team.proposal?.status ?? ("Tidak Ada" as const);
    const isInvited = !isKetua && mahasiswaMembership.statusPersetujuan === "Menunggu";

    return {
      hasTeam: true as const,
      isKetua,
      isInvited,
      statusProposal,
      tim: {
        id: team.id,
        nama: team.nama,
        anggota: team.anggotaTim.map((member) => ({
          id: member.mahasiswa.id,
          nim: member.mahasiswa.nim,
          namaLengkap: member.mahasiswa.user.namaLengkap,
          fotoProfil: member.mahasiswa.user.fotoProfil,
          peran: member.peran,
          kategoriCapstone: member.kategoriCapstone,
          statusPersetujuan: member.statusPersetujuan,
          isCurrentLoginUser: member.mahasiswa.id === mahasiswa.id,
        })),
      },
    };
  } catch (error) {
    console.log("❌ Get Mahasiswa Team Management Data Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}
