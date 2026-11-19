import { StatusBimbingan } from "@/generated/prisma/enums";

export const bimbinganStatusStyles: Record<StatusBimbingan, string> = {
  Menunggu: "bg-blue-500/15 text-blue-500",
  Disetujui: "bg-green-500/15 text-green-500",
  Ditolak: "bg-red-500/15 text-red-500",
};
