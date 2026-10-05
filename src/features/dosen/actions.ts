"use server";

import { prisma } from "@/libs/prisma";
import { hashPassword } from "@/libs/bcrypt";
import { formatZodError } from "@/utils/format-zod-error";
import { ActionResponse } from "@/types";
import { userIsValidAndHasRole } from "@/libs/dal";
import { deleteFile, uploadFileOptional } from "@/utils/file";
import { CreateDosenInput, CreateDosenSchema, UpdateDosenInput, UpdateDosenSchema } from "./schemas";

export async function createDosen(data: CreateDosenInput): Promise<ActionResponse> {
  const parsed = CreateDosenSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { alamatEmail, password, nip, namaLengkap, bidangKeahlian, fotoProfil, status, prodiId, roleId, kuotaBimbingan, statusBimbingan } =
    parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    // Validasi 1 : Cek apakah NIP dan Email sudah digunakan
    const existingDosenAccount = await prisma.user.findFirst({
      where: { OR: [{ identifier: nip }, { alamatEmail }] },
    });

    const nipAlreadyInUsed = existingDosenAccount && existingDosenAccount.identifier === nip;
    const emailAlreadyInUsed = existingDosenAccount && existingDosenAccount.alamatEmail === alamatEmail;

    if (nipAlreadyInUsed) {
      return {
        success: false,
        message: "Gagal menambah dosen baru!",
        errors: { nip: "NIP sudah terdaftar! Silahkan gunakan NIP lain." },
      };
    }

    if (emailAlreadyInUsed) {
      return {
        success: false,
        message: "Gagal menambah dosen baru!",
        errors: { alamatEmail: "Alamat email sudah digunakan! Silahkan gunakan email lain." },
      };
    }

    // Validasi 2 : Cek apakah ID prodi yang dikirim valid
    const prodiIsValid = await prisma.prodi.findUnique({ where: { id: prodiId }, select: { id: true } });

    if (!prodiIsValid) {
      return {
        success: false,
        message: "Gagal menambah dosen baru!",
        errors: { prodiId: "Silahkan pilih prodi yang valid!" },
      };
    }

    // Validasi 3 : Cek apakah semua ID role yang dikirim valid
    const validRoles = await prisma.role.findMany({
      where: { id: { in: roleId } },
      select: { id: true, nama: true },
    });

    const rolesIsValid = validRoles.length === roleId.length;

    if (!rolesIsValid) {
      return {
        success: false,
        message: "Gagal menambah dosen baru!",
        errors: { roleId: "Silahkan pilih role yang valid!" },
      };
    }

    const uploadedImage = await uploadFileOptional({ file: fotoProfil, uploadPath: "/images/profile/dosen/" });

    await prisma
      .$transaction(async (transaction) => {
        // Buat akun dosen
        const hashedPassword = await hashPassword(password);

        const user = await transaction.user.create({
          data: {
            namaLengkap,
            alamatEmail,
            identifier: nip,
            password: hashedPassword,
            fotoProfil: uploadedImage,
            isActive: status === "Aktif" ? true : false,
          },
        });

        // Buat profil dosen
        await transaction.dosen.create({ data: { id: user.id, nip, bidangKeahlian, status, prodiId } });

        // Insert role-role yang dipilih untuk dosen
        await transaction.userRole.createMany({ data: roleId.map((roleId) => ({ userId: user.id, roleId })) });

        // Jika dosen ditetapkan sebagai dosen pembimbing, maka insert detail status dan kuota bimbingannya
        const isDosenPembimbing = validRoles.some((role) => role.nama === "Dosen Pembimbing");

        if (isDosenPembimbing) {
          await transaction.dosenPembimbingDetail.create({
            data: {
              dosenId: user.id,
              batasBimbingan: kuotaBimbingan,
              status: status !== "Aktif" ? "Tutup" : statusBimbingan,
            },
          });
        }
      })
      // Rollback : Hapus file yang telah diupload jika transaction gagal
      .catch(async (error) => {
        if (uploadedImage) await deleteFile(uploadedImage);
        throw error;
      });

    return { success: true, message: "Dosen baru berhasil ditambahkan!" };
  } catch (error) {
    console.log("❌ Create Dosen Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function updateDosen(id: string, data: UpdateDosenInput): Promise<ActionResponse> {
  const parsed = UpdateDosenSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { alamatEmail, password, nip, namaLengkap, bidangKeahlian, fotoProfil, status, prodiId, roleId, kuotaBimbingan, statusBimbingan } =
    parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    // Validasi 1 : Cek apakah data akun dan profil dosen ditemukan
    const existingUser = await prisma.user.findUnique({ where: { id }, include: { dosen: true } });

    const dosenNotFound = !existingUser || !existingUser.dosen;

    if (dosenNotFound) {
      return { success: false, message: "Data dosen tidak ditemukan!" };
    }

    // Validasi 2 : Cek apakah NIP dan Email sudah digunakan
    const duplicateAccount = await prisma.user.findFirst({
      where: {
        AND: [{ id: { not: id } }, { OR: [{ identifier: nip }, { alamatEmail }] }],
      },
    });

    const nipAlreadyInUsed = duplicateAccount && duplicateAccount.identifier === nip;
    const emailAlreadyInUsed = duplicateAccount && duplicateAccount.alamatEmail === alamatEmail;

    if (nipAlreadyInUsed) {
      return {
        success: false,
        message: "Gagal memperbaharui data dosen!",
        errors: { nip: "NIP sudah terdaftar! Silahkan gunakan NIP lain." },
      };
    }

    if (emailAlreadyInUsed) {
      return {
        success: false,
        message: "Gagal memperbaharui data dosen!",
        errors: { alamatEmail: "Alamat email sudah digunakan! Silahkan gunakan email lain." },
      };
    }

    // Validasi 3 : Cek apakah ID prodi yang dikirim valid
    const prodiIsValid = await prisma.prodi.findUnique({ where: { id: prodiId }, select: { id: true } });

    if (!prodiIsValid) {
      return {
        success: false,
        message: "Gagal memperbaharui data dosen!",
        errors: { prodiId: "Silahkan pilih prodi yang valid!" },
      };
    }

    // Validasi 4 : Cek apakah semua ID role yang dikirim valid
    const validRoles = await prisma.role.findMany({
      where: { id: { in: roleId } },
      select: { id: true, nama: true },
    });

    const rolesIsValid = validRoles.length === roleId.length;

    if (!rolesIsValid) {
      return {
        success: false,
        message: "Gagal memperbaharui data dosen!",
        errors: { roleId: "Silahkan pilih role yang valid!" },
      };
    }

    // Validasi 5 : Cek apakah foto profil dosen harus dihapus atau direplace dengan yang baru
    let newUploadedPhotoPath = null;
    let finalProfilePhotoPath = existingUser.fotoProfil;

    const dosenHasProfilePhoto = typeof existingUser.fotoProfil === "string";
    const isProfilePhotoExplicitlyRemoved = !fotoProfil;
    const isNewProfilePhotoUploaded = fotoProfil instanceof File;

    if (isProfilePhotoExplicitlyRemoved) {
      finalProfilePhotoPath = null;
    }

    if (isNewProfilePhotoUploaded) {
      newUploadedPhotoPath = await uploadFileOptional({ file: fotoProfil, uploadPath: "/images/profile/dosen/" });
      finalProfilePhotoPath = newUploadedPhotoPath;
    }

    await prisma
      .$transaction(async (transaction) => {
        // Update akun dosen
        const finalPassword = password ? await hashPassword(password) : existingUser.password;

        await transaction.user.update({
          where: { id },
          data: {
            namaLengkap,
            alamatEmail,
            identifier: nip,
            password: finalPassword,
            fotoProfil: finalProfilePhotoPath,
            isActive: status === "Aktif" ? true : false,
          },
        });

        // Update profil dosen
        await transaction.dosen.update({ where: { id }, data: { nip, bidangKeahlian, status, prodiId } });

        // Update role untuk dosen (berdasarkan role-role yang dipilih)
        await transaction.userRole.deleteMany({ where: { userId: id } });
        await transaction.userRole.createMany({ data: roleId.map((roleId) => ({ userId: id, roleId })) });

        // Jika dosen ditetapkan sebagai dosen pembimbing, maka update detail status dan kuota bimbingannya
        const isPembimbing = validRoles.some((role) => role.nama === "Dosen Pembimbing");
        const finalStatusBimbingan = status !== "Aktif" ? "Tutup" : statusBimbingan;

        if (isPembimbing) {
          await transaction.dosenPembimbingDetail.upsert({
            where: { dosenId: id },
            create: { dosenId: id, batasBimbingan: kuotaBimbingan, status: finalStatusBimbingan },
            update: { batasBimbingan: kuotaBimbingan, status: finalStatusBimbingan },
          });
        }

        // Jika role "Dosen Pembimbing" dicabut, maka hapus detailnya
        if (!isPembimbing) {
          await transaction.dosenPembimbingDetail.deleteMany({ where: { dosenId: id } });
        }
      })

      // Rollback : Hapus file baru yang telah diupload jika transaction gagal
      .catch(async (error) => {
        if (newUploadedPhotoPath) await deleteFile(newUploadedPhotoPath);
        throw error;
      });

    // Validasi 6 : Cek apakah file foto profil lama harus dihapus
    const shouldDeleteOldProfilePhoto = dosenHasProfilePhoto && (isNewProfilePhotoUploaded || isProfilePhotoExplicitlyRemoved);

    if (shouldDeleteOldProfilePhoto) {
      await deleteFile(existingUser.fotoProfil as string);
    }

    return { success: true, message: "Dosen berhasil diperbaharui!" };
  } catch (error) {
    console.log("❌ Update Dosen Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}
