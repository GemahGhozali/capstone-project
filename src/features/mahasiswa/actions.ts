"use server";

import {
  CreateMahasiswaInput,
  UpdateMahasiswaInput,
  ImportMahasiswaInput,
  CreateMahasiswaSchema,
  UpdateMahasiswaSchema,
  ImportMahasiswaSchema,
  BulkDeleteMahasiswaSchema,
  BulkUpdateStatusMahasiswaSchema,
} from "./schemas";

import { prisma } from "@/libs/prisma";
import { formatZodError } from "@/utils/format-zod-error";
import { ActionResponse } from "@/types";
import { StatusMahasiswa } from "@/generated/prisma/enums";
import { userIsValidAndHasRole } from "@/libs/dal";
import { deleteFile, uploadFileOptional } from "@/utils/file";
import { hashPassword, hashPasswordsInBatches } from "@/libs/bcrypt";
import { ImportMahasiswaResult, MahasiswaImportColumn } from "./types";
import { createImportedMahasiswaAccounts, prepareMahasiswaImportRows } from "./services";
import { ExcelReadError, getFilledExcelRows, readExcelSheet, resolveExcelColumnIndexes, ExcelSheetRows } from "@/libs/excel";

export async function createMahasiswa(data: CreateMahasiswaInput): Promise<ActionResponse> {
  const parsed = CreateMahasiswaSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { fotoProfil, namaLengkap, nim, kelasId, tanggalMasuk, status, alamatEmail, password } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    // Validasi 1 : Cek apakah NIM dan Email sudah digunakan
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ identifier: nim }, { alamatEmail }] },
    });

    const nimAlreadyInUsed = existingUser && existingUser.identifier === nim;
    const emailAlreadyInUsed = existingUser && existingUser.alamatEmail === alamatEmail;

    if (nimAlreadyInUsed) {
      return {
        success: false,
        message: "Gagal menambah data mahasiswa!",
        errors: { nim: "NIM sudah terdaftar! Silahkan gunakan NIM lain." },
      };
    }

    if (emailAlreadyInUsed) {
      return {
        success: false,
        message: "Gagal menambah data mahasiswa!",
        errors: { alamatEmail: "Alamat email sudah digunakan! Silahkan gunakan email lain." },
      };
    }

    // Validasi 2 : Cek apakah ID kelas yang dikirim valid
    const kelasIsValid = await prisma.kelas.findUnique({ where: { id: kelasId }, select: { id: true } });

    if (!kelasIsValid) {
      return {
        success: false,
        message: "Gagal menambah data mahasiswa!",
        errors: { prodiId: "Silahkan pilih kelas yang valid!" },
      };
    }

    const mahasiswaRole = await prisma.role.findUnique({ where: { nama: "Mahasiswa" }, select: { id: true } });

    if (!mahasiswaRole) throw new Error("Role mahasiswa tidak ditemukan di database!");

    const uploadedImage = await uploadFileOptional({ file: fotoProfil, uploadPath: "/images/mahasiswa/" });

    await prisma
      .$transaction(async (transaction) => {
        // Buat akun mahasiswa
        const hashedPassword = await hashPassword(password);

        const user = await transaction.user.create({
          data: {
            namaLengkap,
            alamatEmail,
            identifier: nim,
            password: hashedPassword,
            fotoProfil: uploadedImage,
            isActive: status === "Aktif" || status === "Tuntas",
          },
        });

        // Buat profil mahasiswa
        await transaction.mahasiswa.create({ data: { id: user.id, nim, tanggalMasuk, kelasId, status } });

        // Insert role mahasiswa
        await transaction.userRole.create({ data: { userId: user.id, roleId: mahasiswaRole.id } });
      })

      // Rollback : Hapus file yang telah diupload jika transaction gagal
      .catch(async (error) => {
        if (uploadedImage) await deleteFile(uploadedImage);
        throw error;
      });

    return { success: true, message: "Mahasiswa berhasil ditambahkan!" };
  } catch (error) {
    console.log("❌ Create Mahasiswa Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function updateMahasiswa(id: string, data: UpdateMahasiswaInput): Promise<ActionResponse> {
  const parsed = UpdateMahasiswaSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { fotoProfil, namaLengkap, nim, kelasId, tanggalMasuk, status, alamatEmail, password } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    // Validasi 1 : Cek apakah data akun dan profil mahasiswa ditemukan
    const existingUser = await prisma.user.findUnique({ where: { id }, include: { mahasiswa: true } });

    const mahasiswaNotFound = !existingUser || !existingUser.mahasiswa;

    if (mahasiswaNotFound) {
      return { success: false, message: "Data mahasiswa tidak ditemukan!" };
    }

    // Validasi 2 : Cek apakah NIP dan Email sudah digunakan
    const duplicateAccount = await prisma.user.findFirst({
      where: {
        AND: [{ id: { not: id } }, { OR: [{ identifier: nim }, { alamatEmail }] }],
      },
    });

    const nimAlreadyInUsed = duplicateAccount && duplicateAccount.identifier === nim;
    const emailAlreadyInUsed = duplicateAccount && duplicateAccount.alamatEmail === alamatEmail;

    if (nimAlreadyInUsed) {
      return {
        success: false,
        message: "Gagal memperbaharui data mahasiswa!",
        errors: { nim: "NIM sudah terdaftar! Silahkan gunakan NIM lain." },
      };
    }

    if (emailAlreadyInUsed) {
      return {
        success: false,
        message: "Gagal memperbaharui data mahasiswa!",
        errors: { alamatEmail: "Alamat email sudah digunakan! Silahkan gunakan email lain." },
      };
    }

    // Validasi 3 : Cek apakah ID kelas yang dikirim valid
    const kelasIsValid = await prisma.kelas.findUnique({ where: { id: kelasId }, select: { id: true } });

    if (!kelasIsValid) {
      return {
        success: false,
        message: "Gagal memperbaharui data mahasiswa!",
        errors: { prodiId: "Silahkan pilih kelas yang valid!" },
      };
    }

    // Validasi 4 : Cek apakah foto profil mahasiswa harus dihapus atau direplace dengan yang baru
    let newUploadedPhotoPath = null;
    let finalProfilePhotoPath = existingUser.fotoProfil;

    const mahasiswaHasProfilePhoto = typeof existingUser.fotoProfil === "string";
    const isProfilePhotoExplicitlyRemoved = !fotoProfil;
    const isNewProfilePhotoUploaded = fotoProfil instanceof File;

    if (isProfilePhotoExplicitlyRemoved) {
      finalProfilePhotoPath = null;
    }

    if (isNewProfilePhotoUploaded) {
      newUploadedPhotoPath = await uploadFileOptional({ file: fotoProfil, uploadPath: "/images/mahasiswa/" });
      finalProfilePhotoPath = newUploadedPhotoPath;
    }

    await prisma
      .$transaction(async (transaction) => {
        // Update akun mahasiswa
        const finalPassword = password ? await hashPassword(password) : existingUser.password;

        await transaction.user.update({
          where: { id },
          data: {
            namaLengkap,
            alamatEmail,
            identifier: nim,
            password: finalPassword,
            fotoProfil: finalProfilePhotoPath,
            isActive: status === "Aktif" || status === "Tuntas",
          },
        });

        // Update profil mahasiswa
        await transaction.mahasiswa.update({ where: { id }, data: { nim, tanggalMasuk, kelasId, status } });
      })
      // Rollback : Hapus file baru yang telah diupload jika transaction gagal
      .catch(async (error) => {
        if (newUploadedPhotoPath) await deleteFile(newUploadedPhotoPath);
        throw error;
      });

    // Validasi 5 : Cek apakah file foto profil lama harus dihapus
    const shouldDeleteOldProfilePhoto = mahasiswaHasProfilePhoto && (isNewProfilePhotoUploaded || isProfilePhotoExplicitlyRemoved);

    if (shouldDeleteOldProfilePhoto) {
      await deleteFile(existingUser.fotoProfil as string);
    }

    return { success: true, message: "Mahasiswa berhasil diperbaharui!" };
  } catch (error) {
    console.log("❌ Update Mahasiswa Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function deleteMahasiswa(id: string): Promise<ActionResponse> {
  try {
    await userIsValidAndHasRole("Kaprodi");

    // Validasi 1 : Cek apakah data akun dan profil mahasiswa ditemukan
    const existingUser = await prisma.user.findUnique({ where: { id }, include: { mahasiswa: true } });

    const mahasiswaNotFound = !existingUser || !existingUser.mahasiswa;

    if (mahasiswaNotFound) {
      return { success: false, message: "Data mahasiswa tidak ditemukan!" };
    }

    // Validasi 2 : Cek apakah data akun mahasiswa memiliki file foto profil
    const mahasiswaHasProfilePhoto = existingUser.fotoProfil;

    if (mahasiswaHasProfilePhoto) {
      await deleteFile(existingUser.fotoProfil as string);
    }

    await prisma.user.delete({ where: { id } });

    return { success: true, message: "Mahasiswa berhasil dihapus!" };
  } catch (error) {
    console.log("❌ Delete Mahasiswa Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function bulkUpdateStatusMahasiswa(ids: string[], status: StatusMahasiswa): Promise<ActionResponse> {
  const parsed = BulkUpdateStatusMahasiswaSchema.safeParse({ ids, status });

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { ids: validIds, status: validStatus } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    const isActive = validStatus === "Aktif" || validStatus === "Tuntas";

    const [updatedUsers] = await prisma.$transaction([
      // Update status keaktifan akun
      prisma.user.updateMany({ where: { id: { in: validIds }, mahasiswa: { isNot: null } }, data: { isActive } }),

      // Update status mahasiswa
      prisma.mahasiswa.updateMany({ where: { id: { in: validIds } }, data: { status: validStatus } }),
    ]);

    return { success: true, message: `${updatedUsers.count} mahasiswa berhasil diubah statusnya!` };
  } catch (error) {
    console.log("❌ Bulk Update Status Mahasiswa Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function bulkDeleteMahasiswa(ids: string[]): Promise<ActionResponse> {
  const parsed = BulkDeleteMahasiswaSchema.safeParse({ ids });

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { ids: validIds } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    const users = await prisma.user.findMany({
      where: { id: { in: validIds }, mahasiswa: { isNot: null } },
      select: { id: true, fotoProfil: true },
    });

    const userIds = users.map((user) => user.id);

    await prisma.user.deleteMany({ where: { id: { in: userIds } } });

    // Hapus file foto profil mahasiswa saat data berhasil dihapus
    const photoPaths = users.map((user) => user.fotoProfil).filter((photoPath) => photoPath !== null);

    if (photoPaths.length > 0) {
      await Promise.all(photoPaths.map((photoPath) => deleteFile(photoPath)));
    }

    return { success: true, message: `${users.length} mahasiswa berhasil dihapus!` };
  } catch (error) {
    console.log("❌ Bulk Delete Mahasiswa Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

const MAX_MAHASISWA_IMPORT_ROWS = 500;

const MAHASISWA_IMPORT_COLUMN_ALIASES = {
  nim: ["nim"],
  namaLengkap: ["nama lengkap", "nama"],
  kodeKelas: ["kode kelas"],
  tanggalMasuk: ["tanggal masuk"],
} as const satisfies Record<MahasiswaImportColumn, readonly string[]>;

const MAHASISWA_IMPORT_COLUMN_LABELS: Record<MahasiswaImportColumn, string> = {
  nim: "NIM",
  namaLengkap: "Nama Lengkap",
  kodeKelas: "Kode Kelas",
  tanggalMasuk: "Tanggal Masuk",
};

export async function importMahasiswa(data: ImportMahasiswaInput): Promise<ActionResponse<ImportMahasiswaResult>> {
  const parsed = ImportMahasiswaSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "File tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { file, defaultPassword } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    let rows: ExcelSheetRows;

    try {
      rows = await readExcelSheet(file);
    } catch (error) {
      if (error instanceof ExcelReadError) {
        console.error("❌ Import Mahasiswa Error :", error);
        return { success: false, message: error.message };
      }

      throw error;
    }

    const [headerRow = [], ...dataRows] = rows;

    const columns = resolveExcelColumnIndexes(headerRow, MAHASISWA_IMPORT_COLUMN_ALIASES);

    if (!columns.exist) {
      const missingHeaderColumns = columns.missingColumns.map((column) => MAHASISWA_IMPORT_COLUMN_LABELS[column]).join(", ");
      return { success: false, message: `Kolom tidak ditemukan : ${missingHeaderColumns}. Silahkan gunakan template yang disediakan.` };
    }

    const filledDataRows = getFilledExcelRows(dataRows, { startRowNumber: 2 });

    if (filledDataRows.length === 0) {
      return { success: false, message: "File Excel tidak berisi data mahasiswa!" };
    }

    if (filledDataRows.length > MAX_MAHASISWA_IMPORT_ROWS) {
      return {
        success: false,
        message: `Maksimal ${MAX_MAHASISWA_IMPORT_ROWS} baris per import. File Anda berisi ${filledDataRows.length} baris.`,
      };
    }

    const { rowsToCreate, rowErrors } = await prepareMahasiswaImportRows(filledDataRows, columns.columnIndexes);

    if (rowErrors.length > 0) {
      rowErrors.sort((a, b) => a.row - b.row);

      return {
        success: false,
        message: `Terdapat ${rowErrors.length} kesalahan data! Tidak ada data yang diimport.`,
        data: { errors: rowErrors },
      };
    }

    const mahasiswaRole = await prisma.role.findUnique({ where: { nama: "Mahasiswa" }, select: { id: true } });

    if (!mahasiswaRole) throw new Error("Role mahasiswa tidak ditemukan di database!");

    const hashedPassword = await hashPassword(defaultPassword);

    await createImportedMahasiswaAccounts(rowsToCreate, hashedPassword, mahasiswaRole.id);

    return { success: true, message: `${rowsToCreate.length} mahasiswa berhasil diimpor!` };
  } catch (error) {
    console.log("❌ Import Mahasiswa Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}
