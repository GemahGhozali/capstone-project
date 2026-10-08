"use server";

import { prisma } from "@/libs/prisma";
import { formatZodError } from "@/utils/format-zod-error";
import { ActionResponse } from "@/types";
import { userIsValidAndHasRole } from "@/libs/dal";
import { deleteFile, uploadFile } from "@/utils/file";
import { validateDosenPembimbing } from "./services";
import { getResumeStatusLogMessage, resumeStatusColors } from "./utils";
import { ResumeSchema, ResumeInput, ReviewResumeSchema, ReviewResumeInput } from "./schemas";

export async function submitResume(data: ResumeInput): Promise<ActionResponse> {
  const parsed = ResumeSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { subjudul, dosenId, file } = parsed.data;

  try {
    const { id: mahasiswaId } = await userIsValidAndHasRole("Mahasiswa");

    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      select: {
        anggotaTim: {
          select: {
            tim: {
              select: {
                proposal: {
                  select: {
                    id: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
        resume: {
          select: {
            id: true,
          },
        },
      },
    });

    // Validasi 1 : Cek apakah mahasiswa sudah berada didalam tim
    const anggotaTim = mahasiswa?.anggotaTim;

    if (!anggotaTim) {
      return { success: false, message: "Anda belum terdaftar di dalam tim manapun!" };
    }

    // Validasi 2 : Cek apakah tim mahasiswa sudah mengajukan proposal
    const proposal = anggotaTim.tim.proposal;

    if (!proposal) {
      return { success: false, message: "Tim Anda belum mengajukan proposal!" };
    }

    // Validasi 3 : Cek apakah proposal tim sudah disetujui
    const proposalAlreadyApproved = proposal.status === "Disetujui";

    if (!proposalAlreadyApproved) {
      return { success: false, message: "Proposal tim Anda belum disetujui!" };
    }

    // Validasi 4 : Cek apakah mahasiswa sudah pernah mengajukan resume
    if (mahasiswa.resume) {
      return { success: false, message: "Anda sudah mengajukan resume!" };
    }

    // Validasi 6 : Cek apakah dosen pembimbing yang dipilih memang valid
    const dosenPembimbingNotValid = await validateDosenPembimbing(dosenId);

    if (dosenPembimbingNotValid) {
      return { success: false, message: dosenPembimbingNotValid };
    }

    const uploadedResume = await uploadFile({ file, uploadPath: "/documents/resume/" });

    await prisma
      .$transaction(async (transaction) => {
        // Membuat data resume mahasiswa
        const newResume = await transaction.resume.create({
          data: {
            subjudul,
            dosenId,
            mahasiswaId,
            file: uploadedResume,
            proposalId: proposal.id,
          },
        });

        // Membuat log aktivitas resume
        await transaction.activityLog.create({
          data: {
            userId: mahasiswaId,
            entity: "Resume",
            entityId: newResume.id,
            pesan: "Resume telah disubmit dan menunggu review Dosen Pembimbing",
            warna: "Info",
          },
        });
      })

      // Rollback : Hapus file resume yang telah diupload jika transaction gagal
      .catch(async (error) => {
        if (uploadedResume) await deleteFile(uploadedResume);
        throw error;
      });

    return { success: true, message: "Resume berhasil disubmit!" };
  } catch (error) {
    console.log("❌ Submit Resume Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function updateResume(id: string, data: ResumeInput): Promise<ActionResponse> {
  const parsed = ResumeSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { subjudul, dosenId, file } = parsed.data;

  try {
    const { id: mahasiswaId } = await userIsValidAndHasRole("Mahasiswa");

    const resume = await prisma.resume.findUnique({
      where: { id },
      select: {
        id: true,
        file: true,
        status: true,
        mahasiswaId: true,
      },
    });

    // Validasi 1 : Cek apakah data resume ditemukan
    if (!resume) {
      return { success: false, message: "Resume tidak ditemukan!" };
    }

    // Validasi 2 : Cek apakah resume milik mahasiswa yang sedang login
    const resumeOwnedByAnotherStudent = resume.mahasiswaId !== mahasiswaId;

    if (resumeOwnedByAnotherStudent) {
      return { success: false, message: "Anda tidak berhak mengedit resume ini!" };
    }

    // Validasi 3 : Cek apakah status resume memperbolehkan edit (hanya Ditolak)
    const resumeAlreadyApproved = resume.status === "Disetujui";

    if (resumeAlreadyApproved) {
      return { success: false, message: "Resume anda tidak bisa diubah karena telah disetujui!" };
    }

    // Validasi 4 : Cek apakah dosen pembimbing yang dipilih memenuhi syarat
    const dosenPembimbingNotValid = await validateDosenPembimbing(dosenId);

    if (dosenPembimbingNotValid) {
      return { success: false, message: dosenPembimbingNotValid };
    }

    // Validasi 5 : Cek apakah file resume harus direplace dengan yang baru
    let newUploadedResumePath = null;
    let finalResumePath = resume.file;

    const isNewResumeUploaded = file instanceof File;

    if (isNewResumeUploaded) {
      newUploadedResumePath = await uploadFile({ file, uploadPath: "/documents/resume/" });
      finalResumePath = newUploadedResumePath;
    }

    await prisma
      .$transaction(async (transaction) => {
        // Memperbaharui data resume dan reset status menjadi "Menunggu"
        await transaction.resume.update({
          where: { id: resume.id },
          data: { subjudul, dosenId, file: finalResumePath, status: "Menunggu" },
        });

        // Membuat log aktivitas resume
        await transaction.activityLog.create({
          data: {
            userId: mahasiswaId,
            entity: "Resume",
            entityId: resume.id,
            pesan: "Resume telah diperbarui dan menunggu review Dosen Pembimbing",
            warna: "Info",
          },
        });
      })

      // Rollback : Hapus file resume baru yang telah diupload jika transaction gagal
      .catch(async (error) => {
        if (newUploadedResumePath) await deleteFile(newUploadedResumePath);
        throw error;
      });

    // Validasi 6 : Cek apakah file resume lama perlu dihapus
    if (isNewResumeUploaded) {
      await deleteFile(resume.file);
    }

    return { success: true, message: "Resume berhasil diperbaharui!" };
  } catch (error) {
    console.log("❌ Update Resume Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function reviewResume(id: string, data: ReviewResumeInput): Promise<ActionResponse> {
  const parsed = ReviewResumeSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { status: newStatus, catatan } = parsed.data;

  try {
    const { id: dosenId } = await userIsValidAndHasRole("Dosen Pembimbing");

    const resume = await prisma.resume.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        dosenId: true,
        mahasiswaId: true,
      },
    });

    // Validasi 1 : Cek apakah data resume ditemukan
    if (!resume) {
      return { success: false, message: "Resume tidak ditemukan!" };
    }

    // Validasi 2 : Cek apakah reviewer adalah dosen pembimbing yang dipilih
    const reviewerIsNotSelectedSupervisor = resume.dosenId !== dosenId;

    if (reviewerIsNotSelectedSupervisor) {
      return { success: false, message: "Hanya dosen pembimbing terpilih yang berhak me-review resume ini!" };
    }

    // Validasi 3 : Cek apakah status resume masih bisa diset (belum terkunci)
    const currentResumeStatus = resume.status;
    const resumeAvailableToSetStatus = resume.status === "Menunggu";
    const finalResumeStatus = resumeAvailableToSetStatus ? newStatus : currentResumeStatus;
    const resumeIsApproved = resumeAvailableToSetStatus && newStatus === "Disetujui";

    await prisma.$transaction(async (transaction) => {
      // Update status resume jika status resume saat ini masih terbuka (Menunggu)
      if (resumeAvailableToSetStatus) {
        await transaction.resume.update({ where: { id: resume.id }, data: { status: newStatus } });

        // Membuat log aktivitas resume
        await transaction.activityLog.create({
          data: {
            userId: dosenId,
            entity: "Resume",
            entityId: resume.id,
            pesan: getResumeStatusLogMessage(newStatus),
            warna: resumeStatusColors[newStatus],
          },
        });
      }

      // Validasi 4 : Jika resume disetujui, set dosen pembimbing tetap pada mahasiswa
      if (resumeIsApproved) {
        await transaction.mahasiswa.update({
          where: { id: resume.mahasiswaId },
          data: { dosenId: resume.dosenId },
        });
      }

      // Membuat data review resume
      await transaction.resumeReview.create({ data: { resumeId: resume.id, dosenId, catatan, status: finalResumeStatus } });
    });

    return { success: true, message: "Resume berhasil direview!" };
  } catch (error) {
    console.log("❌ Review Resume Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}
