import { StatusTim } from "@/generated/prisma/enums";

export const teamStatusStyles: Record<StatusTim, string> = {
  Aktif: "bg-green-500/15 text-green-500",
  Arsip: "bg-neutral-500/15 text-neutral-500",
};

export const teamCompletenessStatusStyles: Record<string, string> = {
  Lengkap: "bg-green-500/15 text-green-500",
  "Belum Lengkap": "bg-neutral-500/15 text-neutral-500",
};
