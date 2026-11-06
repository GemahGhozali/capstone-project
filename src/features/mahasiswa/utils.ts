import { StatusMahasiswa } from "@/generated/prisma/enums";

export const mahasiswaStatusStyles: Record<StatusMahasiswa, string> = {
  Aktif: "bg-green-500/15 text-green-500",
  Nonaktif: "bg-red-500/15 text-red-500",
  Arsip: "bg-neutral-500/15 text-neutral-500",
};
