"use server";

import { prisma } from "@/libs/prisma";
import { formatZodError } from "@/utils/format-zod-error";
import { ActionResponse } from "@/types";
import { userIsValidAndHasRole } from "@/libs/dal";
import { ProdiInput, ProdiSchema } from "./schemas";

export async function createProdi(data: ProdiInput): Promise<ActionResponse> {
  const parsed = ProdiSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { nama } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    const prodiAlreadyExist = await prisma.prodi.findUnique({ where: { nama } });

    if (prodiAlreadyExist) {
      return { success: false, message: `Prodi '${nama}' sudah terdaftar!` };
    }

    await prisma.prodi.create({ data: { nama } });

    return { success: true, message: "Prodi berhasil dibuat!" };
  } catch (error) {
    console.log("❌ Create Prodi Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function updateProdi(id: string, data: ProdiInput): Promise<ActionResponse> {
  const parsed = ProdiSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { nama } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    const isProdiFound = await prisma.prodi.findUnique({ where: { id } });

    if (!isProdiFound) {
      return { success: false, message: "Data prodi tidak ditemukan!" };
    }

    const prodiAlreadyExist = await prisma.prodi.findFirst({ where: { nama, NOT: { id } } });

    if (prodiAlreadyExist) {
      return { success: false, message: `Prodi '${nama}' sudah terdaftar!` };
    }

    await prisma.prodi.update({ where: { id }, data: { nama } });

    return { success: true, message: "Prodi berhasil diperbarui!" };
  } catch (error) {
    console.log("❌ Update Prodi Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}
