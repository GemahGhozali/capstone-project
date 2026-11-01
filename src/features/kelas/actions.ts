"use server";

import { prisma } from "@/libs/prisma";
import { formatZodError } from "@/utils/format-zod-error";
import { ActionResponse } from "@/types";
import { userIsValidAndHasRole } from "@/libs/dal";
import { KelasInput, KelasSchema } from "./schemas";

export async function createKelas(data: KelasInput): Promise<ActionResponse> {
  const parsed = KelasSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { nama, kode, angkatan } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    const classAlreadyExist = await prisma.kelas.findUnique({ where: { nama_angkatan: { nama, angkatan } } });

    if (classAlreadyExist) {
      return {
        success: false,
        message: "Gagal menambah kelas!",
        errors: { nama: `Kelas dengan nama '${nama}' di angkatan ${angkatan} sudah terdaftar!` },
      };
    }

    const classCodeAlreadyExist = await prisma.kelas.findUnique({ where: { kode } });

    if (classCodeAlreadyExist) {
      return {
        success: false,
        message: "Gagal menambah kelas!",
        errors: { kode: "Kode kelas sudah digunakan! Silahkan gunakan kombinasi lain." },
      };
    }

    await prisma.kelas.create({ data: { nama, kode, angkatan } });

    return { success: true, message: "Kelas berhasil ditambahkan!" };
  } catch (error) {
    console.log("❌ Create Kelas Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function updateKelas(id: string, data: KelasInput): Promise<ActionResponse> {
  const parsed = KelasSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { nama, kode, angkatan } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    const isClassFound = await prisma.kelas.findUnique({ where: { id } });

    if (!isClassFound) {
      return { success: false, message: "Data kelas tidak ditemukan!" };
    }

    const classAlreadyExist = await prisma.kelas.findUnique({ where: { nama_angkatan: { nama, angkatan }, NOT: { id } } });

    if (classAlreadyExist) {
      return {
        success: false,
        message: "Gagal memperbaharui kelas!",
        errors: { nama: `Kelas dengan nama '${nama}' di angkatan ${angkatan} sudah terdaftar!` },
      };
    }

    const classCodeAlreadyExist = await prisma.kelas.findUnique({ where: { kode, NOT: { id } } });

    if (classCodeAlreadyExist) {
      return {
        success: false,
        message: "Gagal memperbaharui kelas!",
        errors: { kode: "Kode kelas sudah digunakan! Silahkan gunakan kombinasi lain." },
      };
    }

    await prisma.kelas.update({ where: { id }, data: { nama, kode, angkatan } });

    return { success: true, message: "Kelas berhasil diperbaharui!" };
  } catch (error) {
    console.log("❌ Create Kelas Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}
