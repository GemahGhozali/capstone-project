"use server";

import { prisma } from "@/libs/prisma";
import { formatZodError } from "@/utils/format-zod-error";
import { ActionResponse } from "@/types";
import { userIsValidAndHasRole } from "@/libs/dal";
import { deleteFile, uploadFile } from "@/utils/file";
import { getProposalStatusLogMessage, proposalStatusColors } from "./utils";
import { ProposalSchema, ProposalInput, ReviewProposalInput, ReviewProposalSchema } from "./schemas";

export async function submitProposal(data: ProposalInput): Promise<ActionResponse> {
  const parsed = ProposalSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { judul, mitra, file } = parsed.data;

  try {
    const { id: mahasiswaId } = await userIsValidAndHasRole("Mahasiswa");

    const mahasiswa = await prisma.anggotaTim.findUnique({
      where: { mahasiswaId },
      select: {
        peran: true,
        tim: {
          select: {
            id: true,
            anggotaTim: {
              select: {
                statusPersetujuan: true,
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

    // Validasi 1 : Cek apakah mahasiswa sudah berada didalam tim
    const mahasiswaNotInTeam = !mahasiswa || !mahasiswa.tim;

    if (mahasiswaNotInTeam) {
      return { success: false, message: "Anda belum terdaftar di dalam tim manapun!" };
    }

    // Validasi 2 : Cek apakah mahasiswa berperan sebagai ketua
    const mahasiswIsNotLeader = mahasiswa.peran !== "Ketua";

    if (mahasiswIsNotLeader) {
      return { success: false, message: "Hanya ketua tim yang diizinkan untuk mengajukan proposal!" };
    }

    // Validasi 3 : Cek apakah seluruh anggota didalam tim sudah menyetujui undangan tim
    const allTeamMemberApproved = mahasiswa.tim.anggotaTim.every((anggota) => anggota.statusPersetujuan === "Disetujui");

    if (!allTeamMemberApproved) {
      return { success: false, message: "Seluruh anggota tim harus menyetujui undangan tim terlebih dahulu!" };
    }

    // Validasi 4 : Cek apakah tim mahasiswa sudah memiliki proposal
    const team = mahasiswa.tim;
    const mahasiswaTeamAlreadyHasProposal = team.proposal;

    if (mahasiswaTeamAlreadyHasProposal) {
      return { success: false, message: "Tim Anda sudah mengajukan proposal!" };
    }

    const uploadedProposal = await uploadFile({ file, uploadPath: "/documents/proposal/" });

    await prisma
      .$transaction(async (trancastion) => {
        // Membuat data proposal tim
        const newProposal = await trancastion.proposal.create({
          data: { judul, mitra, file: uploadedProposal, timId: team.id },
        });

        // Membuat log aktivitas tim
        await trancastion.activityLog.create({
          data: {
            userId: mahasiswaId,
            entity: "Tim",
            entityId: team.id,
            pesan: "Ketua Tim telah mengajukan proposal",
            warna: "Info",
          },
        });

        // Membuat log aktivitas proposal
        await trancastion.activityLog.create({
          data: {
            userId: mahasiswaId,
            entity: "Proposal",
            entityId: newProposal.id,
            pesan: "Proposal telah disubmit dan menunggu review Dosen Capstone Project",
            warna: "Info",
          },
        });
      })

      // Rollback : Hapus file proposal yang telah diupload jika transaction gagal
      .catch(async (error) => {
        if (uploadedProposal) await deleteFile(uploadedProposal);
        throw error;
      });

    return { success: true, message: "Proposal berhasil disubmit!" };
  } catch (error) {
    console.log("❌ Submit Proposal Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function updateProposal(id: string, data: ProposalInput): Promise<ActionResponse> {
  const parsed = ProposalSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { judul, mitra, file } = parsed.data;

  try {
    const { id: mahasiswaId } = await userIsValidAndHasRole("Mahasiswa");

    // Validasi 1 : Cek apakah data proposal ditemukan
    const proposal = await prisma.proposal.findUnique({
      where: { id },
      select: {
        id: true,
        file: true,
        status: true,
        tim: {
          select: {
            id: true,
            anggotaTim: {
              where: { mahasiswaId },
              select: { peran: true },
            },
          },
        },
      },
    });

    if (!proposal) {
      return { success: false, message: "Proposal tidak ditemukan!" };
    }

    const mahasiswaMembership = proposal.tim.anggotaTim[0];

    if (!mahasiswaMembership) {
      return { success: false, message: "Anda bukan anggota tim pemilik proposal ini!" };
    }

    // Validasi 2 : Cek apakah mahasiswa berperan sebagai ketua tim
    const mahasiswaRole = mahasiswaMembership.peran;
    const mahasiswaIsNotLeader = mahasiswaRole !== "Ketua";

    if (mahasiswaIsNotLeader) {
      return { success: false, message: "Hanya ketua tim yang diizinkan untuk mengedit proposal!" };
    }

    // Validasi 3 : Cek apakah status proposal sudah disetujui
    const proposalStatus = proposal.status;
    const proposalAlreadyApproved = proposalStatus === "Disetujui";

    if (proposalAlreadyApproved) {
      return { success: false, message: "Proposal tidak bisa diubah karena telah disetujui!" };
    }

    // Validasi 4 : Cek apakah proposal harus direplace dengan yang baru
    let newUploadedProposalPath = null;
    let finalProposalPath = proposal.file;

    const isNewProposalUploaded = file instanceof File;

    if (isNewProposalUploaded) {
      newUploadedProposalPath = await uploadFile({ file, uploadPath: "/documents/proposal/" });
      finalProposalPath = newUploadedProposalPath;
    }

    await prisma
      .$transaction(async (transaction) => {
        // Memperbaharui data proposal dan reset status menjadi "Menunggu"
        await transaction.proposal.update({
          where: { id: proposal.id },
          data: { judul, mitra, file: finalProposalPath, status: "Menunggu" },
        });

        // Membuat log aktivitas tim
        await transaction.activityLog.create({
          data: {
            userId: mahasiswaId,
            entity: "Tim",
            entityId: proposal.tim.id,
            pesan: "Ketua Tim memperbaharui proposal",
            warna: "Info",
          },
        });

        // Membuat log aktivitas proposal
        await transaction.activityLog.create({
          data: {
            entity: "Proposal",
            entityId: proposal.id,
            userId: mahasiswaId,
            pesan: "Proposal telah diperbaharui dan menunggu review Dosen Capstone Project",
            warna: "Info",
          },
        });
      })

      // Rollback : Hapus file proposal baru yang telah diupload jika transaction gagal
      .catch(async (error) => {
        if (newUploadedProposalPath) await deleteFile(newUploadedProposalPath);
        throw error;
      });

    // Validasi 5 : Cek apakah file proposal lama perlu dihapus
    const oldProposalFile = proposal.file;

    if (isNewProposalUploaded) {
      await deleteFile(oldProposalFile);
    }

    return { success: true, message: "Proposal berhasil diperbaharui!" };
  } catch (error) {
    console.log("❌ Update Proposal Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function reviewProposal(id: string, data: ReviewProposalInput): Promise<ActionResponse> {
  const parsed = ReviewProposalSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { status: newStatus, catatan } = parsed.data;

  try {
    const { id: dosenId } = await userIsValidAndHasRole("Dosen Capstone Project");

    // Validasi 1 : Cek apakah data proposal ditemukan
    const proposal = await prisma.proposal.findUnique({ where: { id }, select: { id: true, status: true } });

    if (!proposal) {
      return { success: false, message: "Proposal tidak ditemukan!" };
    }

    // Validasi 2 : Cek apakah proposal boleh di ubah status nya atau tidak
    const currentProposalStatus = proposal.status;
    const proposalAvailableToSetStatus = proposal.status === "Menunggu";
    const finalProposalStatus = proposalAvailableToSetStatus ? newStatus : currentProposalStatus;

    await prisma.$transaction(async (transaction) => {
      // Update status proposal jika status proposal saat ini masih terbuka (Menunggu)
      if (proposalAvailableToSetStatus) {
        await transaction.proposal.update({ where: { id }, data: { status: newStatus } });

        // Membuat log aktivitas proposal
        await transaction.activityLog.create({
          data: {
            userId: dosenId,
            entity: "Proposal",
            entityId: proposal.id,
            warna: proposalStatusColors[newStatus],
            pesan: getProposalStatusLogMessage(newStatus),
          },
        });
      }

      // Membuat data review proposal
      await transaction.proposalReview.create({ data: { proposalId: proposal.id, dosenId, catatan, status: finalProposalStatus } });
    });

    return { success: true, message: "Proposal berhasil direview!" };
  } catch (error) {
    console.log("❌ Review Proposal Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}
