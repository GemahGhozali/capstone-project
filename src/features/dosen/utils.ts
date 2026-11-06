import { StatusDosen } from "@/generated/prisma/enums";

export const dosenStatusStyles: Record<StatusDosen, string> = {
  Aktif: "bg-green-500/15 text-green-500",
  Nonaktif: "bg-red-500/15 text-red-500",
  Pindah: "bg-neutral-500/15 text-neutral-500",
};
