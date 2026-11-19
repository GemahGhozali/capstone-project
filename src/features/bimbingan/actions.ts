"use server";

import { prisma } from "@/libs/prisma";
import { formatZodError } from "@/utils/format-zod-error";
import { ActionResponse } from "@/types";
import { userIsValidAndHasRole } from "@/libs/dal";
import { deleteFile, uploadFile } from "@/utils/file";
import { BimbinganInput, CreateBimbinganSchema, ReviewBimbinganInput, ReviewBimbinganSchema, UpdateBimbinganSchema } from "./schemas";

export async function createBimbingan(data: BimbinganInput): Promise<ActionResponse> {
  const parsed = CreateBimbinganSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { tanggal, catatan, file } = parsed.data;

  try {
    const { id: mahasiswaId } = await userIsValidAndHasRole("Mahasiswa");

    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      select: {
        dosenId: true,
        resume: {
          select: { status: true },
        },
      },
    });

    if (!mahasiswa?.resume) {
      return { success: false, message: "Anda belum upload resume!" };
    }

    const resumeIsNotApproved = mahasiswa.resume.status !== "Disetujui" && mahasiswa.resume.status !== "Arsip";

    if (resumeIsNotApproved) {
      return { success: false, message: "Resume anda belum disetujui Dosen Pembimbing!" };
    }

    if (!mahasiswa.dosenId) {
      return { success: false, message: "Dosen pembimbing anda belum ditentukan!" };
    }

    const filePath = await uploadFile({ file, uploadPath: "/documents/bimbingan/" });

    try {
      await prisma.bimbingan.create({
        data: {
          mahasiswaId,
          tanggal,
          catatan,
          filePath,
          fileName: file.name,
          fileSize: file.size,
          dosenId: mahasiswa.dosenId,
        },
      });
    } catch (error) {
      await deleteFile(filePath);
      throw error;
    }

    return { success: true, message: "Catatan bimbingan berhasil ditambahkan!" };
  } catch (error) {
    console.error("❌ Create Bimbingan Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function updateBimbingan(id: string, data: BimbinganInput): Promise<ActionResponse> {
  const parsed = UpdateBimbinganSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { tanggal, catatan, file } = parsed.data;

  try {
    const { id: mahasiswaId } = await userIsValidAndHasRole("Mahasiswa");

    const bimbingan = await prisma.bimbingan.findUnique({
      where: { id },
      select: {
        id: true,
        mahasiswaId: true,
        status: true,
        filePath: true,
        fileName: true,
        fileSize: true,
      },
    });

    if (!bimbingan) {
      return { success: false, message: "Catatan bimbingan tidak ditemukan!" };
    }

    if (bimbingan.mahasiswaId !== mahasiswaId) {
      return { success: false, message: "Anda tidak berhak mengubah catatan bimbingan ini!" };
    }

    if (bimbingan.status !== "Menunggu") {
      return { success: false, message: "Catatan bimbingan yang sudah direview tidak bisa diubah!" };
    }

    const isNewFileUploaded = file instanceof File;
    let newUploadedFilePath: string | null = null;

    if (isNewFileUploaded) {
      newUploadedFilePath = await uploadFile({ file, uploadPath: "/documents/bimbingan/" });
    }

    const finalFilePath = newUploadedFilePath ?? bimbingan.filePath;
    const finalFileName = isNewFileUploaded ? file.name : bimbingan.fileName;
    const finalFileSize = isNewFileUploaded ? file.size : bimbingan.fileSize;

    try {
      await prisma.bimbingan.update({
        where: { id: bimbingan.id },
        data: { tanggal, catatan, filePath: finalFilePath, fileName: finalFileName, fileSize: finalFileSize },
      });
    } catch (error) {
      if (newUploadedFilePath) {
        await deleteFile(newUploadedFilePath);
      }

      throw error;
    }

    if (isNewFileUploaded) {
      await deleteFile(bimbingan.filePath);
    }

    return { success: true, message: "Catatan bimbingan berhasil diperbarui!" };
  } catch (error) {
    console.error("❌ Update Bimbingan Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function deleteBimbingan(id: string): Promise<ActionResponse> {
  try {
    const { id: mahasiswaId } = await userIsValidAndHasRole("Mahasiswa");

    const bimbingan = await prisma.bimbingan.findUnique({
      where: { id },
      select: {
        id: true,
        mahasiswaId: true,
        status: true,
        filePath: true,
      },
    });

    if (!bimbingan) {
      return { success: false, message: "Catatan bimbingan tidak ditemukan!" };
    }

    if (bimbingan.mahasiswaId !== mahasiswaId) {
      return { success: false, message: "Anda tidak berhak menghapus catatan bimbingan ini!" };
    }

    if (bimbingan.status !== "Menunggu") {
      return { success: false, message: "Catatan bimbingan yang sudah direview tidak bisa dihapus!" };
    }

    await prisma.bimbingan.delete({ where: { id: bimbingan.id } });
    await deleteFile(bimbingan.filePath);

    return { success: true, message: "Catatan bimbingan berhasil dihapus!" };
  } catch (error) {
    console.error("❌ Delete Bimbingan Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function reviewBimbingan(id: string, data: ReviewBimbinganInput): Promise<ActionResponse> {
  const parsed = ReviewBimbinganSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { status } = parsed.data;

  try {
    const { id: dosenId } = await userIsValidAndHasRole("Dosen Pembimbing");

    const bimbingan = await prisma.bimbingan.findUnique({
      where: { id },
      select: {
        id: true,
        dosenId: true,
        status: true,
      },
    });

    if (!bimbingan) {
      return { success: false, message: "Catatan bimbingan tidak ditemukan!" };
    }

    if (bimbingan.dosenId !== dosenId) {
      return { success: false, message: "Anda tidak berhak memverifikasi catatan bimbingan ini!" };
    }

    if (bimbingan.status !== "Menunggu") {
      return { success: false, message: "Catatan bimbingan ini sudah diverifikasi!" };
    }

    await prisma.bimbingan.update({ where: { id: bimbingan.id }, data: { status } });

    return { success: true, message: status === "Disetujui" ? "Bimbingan berhasil disetujui!" : "Bimbingan berhasil ditolak!" };
  } catch (error) {
    console.error("❌ Review Bimbingan Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}
