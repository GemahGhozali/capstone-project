"use server";

import { prisma } from "@/libs/prisma";
import { ActionResponse } from "@/types";
import { formatZodError } from "@/utils/format-zod-error";
import { userIsValidAndHasRole } from "@/libs/dal";
import { TeamInput, TeamSchema } from "./schemas";
import { PeranAnggotaTim, StatusPersetujuan } from "@/generated/prisma/enums";
import { ensureAllTeamMembersIsValid, validateTeamLeaderDuplication, validateTeamMembersDuplication } from "./services";

export async function createTeam(data: TeamInput): Promise<ActionResponse> {
  const parsed = TeamSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { namaTim, anggota } = parsed.data;

  try {
    const { id: leaderId } = await userIsValidAndHasRole("Mahasiswa");

    // Validasi 1 : Cek apakah ketua sudah memiliki tim
    const leaderAlreadyHasTeam = await prisma.anggotaTim.findUnique({
      where: { mahasiswaId: leaderId },
      select: { id: true },
    });

    if (leaderAlreadyHasTeam) {
      return { success: false, message: "Anda sudah tergabung didalam tim lain dan tidak dapat membuat tim baru!" };
    }

    // Validasi 2 : Cek apakah terdapat duplikasi data ketua di dalam tim
    const teamHasMultipleLeaders = validateTeamLeaderDuplication(leaderId, anggota);

    if (teamHasMultipleLeaders) {
      return {
        success: false,
        message: "Gagal membuat tim!",
        errors: { anggota: "Peran ketua hanya diperbolehkan untuk satu anggota saja!" },
      };
    }

    // Validasi 3 : Cek apakah terdapat duplikasi data anggota tim
    const teamHasDuplicateMembers = validateTeamMembersDuplication(anggota);

    if (teamHasDuplicateMembers) {
      return {
        success: false,
        message: "Gagal membuat tim!",
        errors: { anggota: "Terdapat duplikasi pada data anggota tim!" },
      };
    }

    // Validasi 4 : Cek apakah data mahasiswa yang diundang memang valid
    const teamMemberValidation = await ensureAllTeamMembersIsValid(anggota);

    if (!teamMemberValidation.isValid) {
      return {
        success: false,
        message: "Gagal membuat tim!",
        errors: { anggota: teamMemberValidation.message },
      };
    }

    await prisma.$transaction(async (transaction) => {
      const newTeam = await transaction.tim.create({ data: { nama: namaTim } });

      await transaction.anggotaTim.createMany({
        data: anggota.map((member) => {
          const isLeader = member.id === leaderId;
          const peran = isLeader ? PeranAnggotaTim.Ketua : PeranAnggotaTim.Anggota;
          const statusPersetujuan = isLeader ? StatusPersetujuan.Disetujui : StatusPersetujuan.Menunggu;

          return {
            peran,
            statusPersetujuan,
            timId: newTeam.id,
            mahasiswaId: member.id,
            kategoriCapstone: member.kategoriCapstone,
          };
        }),
      });
    });

    return { success: true, message: "Pembuatan tim berhasil! Undangan telah dikirim ke anggota." };
  } catch (error) {
    console.log("❌ Create Team Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function updateTeam(id: string, data: TeamInput): Promise<ActionResponse> {
  const parsed = TeamSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { namaTim, anggota } = parsed.data;

  try {
    const { id: leaderId } = await userIsValidAndHasRole("Mahasiswa");

    const team = await prisma.tim.findUnique({
      where: { id },
      select: {
        id: true,
        nama: true,
        proposal: { select: { status: true } },
        anggotaTim: {
          select: { mahasiswaId: true, peran: true, kategoriCapstone: true },
        },
      },
    });

    // Validasi 1 : Cek keberadaan tim mahasiswa
    if (!team) {
      return { success: false, message: "Data tim tidak ditemukan!" };
    }

    // Validasi 2 : Cek keanggotaan dan peran mahasiswa di dalam tim
    const mahasiswaMembership = team.anggotaTim.find((member) => member.mahasiswaId === leaderId);

    if (!mahasiswaMembership) {
      return { success: false, message: "Anda bukan anggota tim ini!" };
    }

    if (mahasiswaMembership.peran !== "Ketua") {
      return { success: false, message: "Hanya ketua tim yang boleh mengubah tim!" };
    }

    // Validasi 3 : Cek apakah proposal sedang direview atau telah disetujui
    const teamProposalApproved = team.proposal?.status === "Disetujui";
    const teamProposalUnderReview = team.proposal?.status === "Menunggu";

    if (teamProposalApproved) {
      return { success: false, message: "Tim tidak bisa diubah karena proposal tim anda telah disetujui!" };
    }

    if (teamProposalUnderReview) {
      return { success: false, message: "Tim tidak bisa diubah karena proposal tim anda sedang direview!" };
    }

    // Validasi 4 : Cek apakah terdapat duplikasi data ketua di dalam tim
    const teamHasMultipleLeaders = validateTeamLeaderDuplication(leaderId, anggota);

    if (teamHasMultipleLeaders) {
      return {
        success: false,
        message: "Gagal memperbaharui tim!",
        errors: { anggota: "Peran ketua hanya diperbolehkan untuk satu anggota saja!" },
      };
    }

    // Validasi 5 : Cek apakah terdapat duplikasi data anggota tim
    const teamHasDuplicateMembers = validateTeamMembersDuplication(anggota);

    if (teamHasDuplicateMembers) {
      return {
        success: false,
        message: "Gagal membuat tim!",
        errors: { anggota: "Terdapat duplikasi pada data anggota tim!" },
      };
    }

    // Validasi 6 : Cek keberadaan anggota tim baru, dan validasi semua anggota baru (jika ada)
    const existingTeamMembers = team.anggotaTim.filter((member) => member.mahasiswaId !== leaderId);

    const newInvitedTeamMembers = anggota.filter((member) => {
      const memberIsNotLeader = member.id !== leaderId;
      const memberIsNotInExistingTeamMember = !existingTeamMembers.some((existingMember) => existingMember.mahasiswaId === member.id);
      return memberIsNotLeader && memberIsNotInExistingTeamMember;
    });

    const hasNewInvitedTeamMember = newInvitedTeamMembers.length > 0;

    if (hasNewInvitedTeamMember) {
      const validation = await ensureAllTeamMembersIsValid(newInvitedTeamMembers);

      if (!validation.isValid) {
        return {
          success: false,
          message: "Gagal memperbarui tim!",
          errors: { anggota: validation.message },
        };
      }
    }

    // Validasi 7 : Cek mana anggota yang perlu dihapus dan dipertahankan
    const currentTeamMembers = anggota.filter((member) => member.id !== leaderId);

    const deletedTeamMembers = existingTeamMembers.filter((existingMember) => {
      const existingMemberNotInCurrentTeamMembers = !currentTeamMembers.some((currentMember) => currentMember.id === existingMember.mahasiswaId);
      return existingMemberNotInCurrentTeamMembers;
    });

    const keptMembers = anggota.filter((member) => {
      const memberIsInExisitingTeamMembers = team.anggotaTim.some((a) => a.mahasiswaId === member.id);
      return memberIsInExisitingTeamMembers;
    });

    const teamNameChanged = team.nama !== namaTim;
    const deletedTeamMemberIds = deletedTeamMembers.map((member) => member.mahasiswaId);
    const hasDeletedTeamMembers = deletedTeamMemberIds.length > 0;

    await prisma.$transaction(async (transaction) => {
      if (teamNameChanged) {
        await transaction.tim.update({ where: { id: team.id }, data: { nama: namaTim } });
      }

      if (hasDeletedTeamMembers) {
        await transaction.anggotaTim.deleteMany({
          where: { timId: team.id, mahasiswaId: { in: deletedTeamMemberIds } },
        });
      }

      if (hasNewInvitedTeamMember) {
        await transaction.anggotaTim.createMany({
          data: newInvitedTeamMembers.map((mahasiswa) => ({
            timId: team.id,
            mahasiswaId: mahasiswa.id,
            peran: PeranAnggotaTim.Anggota,
            statusPersetujuan: StatusPersetujuan.Menunggu,
            kategoriCapstone: mahasiswa.kategoriCapstone,
          })),
        });
      }

      for (const member of keptMembers) {
        await transaction.anggotaTim.update({
          where: { mahasiswaId: member.id },
          data: { kategoriCapstone: member.kategoriCapstone },
        });
      }
    });

    return { success: true, message: "Tim berhasil diperbaharui!" };
  } catch (error) {
    console.log("❌ Update Team Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function acceptTeamInvitation(): Promise<ActionResponse> {
  try {
    const { id: mahasiswaId } = await userIsValidAndHasRole("Mahasiswa");

    const { count } = await prisma.anggotaTim.updateMany({
      where: { mahasiswaId, peran: "Anggota", statusPersetujuan: "Menunggu" },
      data: { statusPersetujuan: "Disetujui" },
    });

    const mahasiswaHasNoPendingTeamInvitation = count === 0;

    if (mahasiswaHasNoPendingTeamInvitation) {
      return { success: false, message: "Undangan tim sudah tidak berlaku!" };
    }

    return { success: true, message: "Undangan tim berhasil diterima!" };
  } catch (error) {
    console.log("❌ Accept Team Invitation Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function rejectTeamInvitation(): Promise<ActionResponse> {
  try {
    const { id: mahasiswaId } = await userIsValidAndHasRole("Mahasiswa");

    const { count } = await prisma.anggotaTim.deleteMany({
      where: { mahasiswaId, peran: "Anggota", statusPersetujuan: "Menunggu" },
    });

    const mahasiswaHasNoPendingTeamInvitation = count === 0;

    if (mahasiswaHasNoPendingTeamInvitation) {
      return { success: false, message: "Undangan tim sudah tidak berlaku!" };
    }

    return { success: true, message: "Undangan tim berhasil ditolak!" };
  } catch (error) {
    console.log("❌ Reject Team Invitation Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}
