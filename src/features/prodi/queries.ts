import "server-only";

import { prisma } from "@/libs/prisma";

export async function getAllProdi() {
  try {
    return prisma.prodi.findMany({ select: { id: true, nama: true } });
  } catch (error) {
    throw new Error("Terjadi kesalahan pada server!");
  }
}
