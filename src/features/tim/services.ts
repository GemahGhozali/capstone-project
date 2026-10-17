import "server-only";

import { prisma } from "@/libs/prisma";
import { TeamMemberInput } from "./schemas";

export function validateTeamLeaderDuplication(leaderId: string, teamMembers: TeamMemberInput[]) {
  const totalMatchingLeaderId = teamMembers.filter((member) => member.id === leaderId).length;
  const totalMemberWithPeranKetua = teamMembers.filter((member) => member.peran === "Ketua").length;
  const isLeaderHasPeranKetua = teamMembers.some((member) => member.id === leaderId && member.peran === "Ketua");

  return totalMatchingLeaderId !== 1 || totalMemberWithPeranKetua !== 1 || !isLeaderHasPeranKetua;
}

export async function validateInvitedTeamMembers(teamMembers: TeamMemberInput[]) {
  const invitedMemberIds = teamMembers.map((member) => member.id);

  const uniqueMemberIds = new Set(invitedMemberIds);
  const teamHasDuplicateMembers = invitedMemberIds.length !== uniqueMemberIds.size;

  if (teamHasDuplicateMembers) {
    return { isValid: false, message: "Terdapat duplikasi pada data mahasiswa yang diundang!" };
  }

  const invitedMahasiswa = await prisma.mahasiswa.findMany({
    where: { id: { in: invitedMemberIds } },
    select: {
      id: true,
      nim: true,
      status: true,
      user: { select: { namaLengkap: true, isActive: true } },
      anggotaTim: { select: { id: true } },
    },
  });

  const invitedMahasiswaMap = new Map(invitedMahasiswa.map((mahasiswa) => [mahasiswa.id, mahasiswa]));

  for (const member of teamMembers) {
    const mahasiswa = invitedMahasiswaMap.get(member.id);

    if (!mahasiswa) {
      return { isValid: false, message: `${member.namaLengkap} (${member.nim}) tidak ditemukan sebagai mahasiswa!` };
    }

    const memberNotActiveMahasiswa = mahasiswa.status !== "Aktif" || !mahasiswa.user.isActive;

    if (memberNotActiveMahasiswa) {
      return { isValid: false, message: `${mahasiswa.user.namaLengkap} (${mahasiswa.nim}) bukan mahasiswa berstatus aktif!` };
    }

    const memberAlreadyHasTeam = mahasiswa.anggotaTim;

    if (memberAlreadyHasTeam) {
      return { isValid: false, message: `${mahasiswa.user.namaLengkap} (${mahasiswa.nim}) sudah tergabung dalam tim lain!` };
    }
  }

  return { isValid: true, message: "Semua anggota tim yang diundang valid!" };
}
