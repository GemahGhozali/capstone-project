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

  const { nama, angkatan } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    const classAlreadyExist = await prisma.kelas.findUnique({ where: { nama_angkatan: { nama, angkatan } } });

    if (classAlreadyExist) {
      return { success: false, message: `Kelas '${nama}' untuk angkatan ${angkatan} sudah terdaftar!` };
    }

    await prisma.kelas.create({ data: { nama, angkatan } });

    return { success: true, message: "Kelas berhasil dibuat!" };
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

  const { nama, angkatan } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    const isClassFound = await prisma.kelas.findUnique({ where: { id } });

    if (!isClassFound) {
      return { success: false, message: "Data kelas tidak ditemukan!" };
    }

    const classAlreadyExist = await prisma.kelas.findFirst({ where: { nama, angkatan, NOT: { id } } });

    if (classAlreadyExist) {
      return { success: false, message: `Kelas '${nama}' untuk angkatan ${angkatan} sudah terdaftar!` };
    }

    await prisma.kelas.update({ where: { id }, data: { nama, angkatan } });

    return { success: true, message: "Kelas berhasil dibuat!" };
  } catch (error) {
    console.log("❌ Create Kelas Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}
