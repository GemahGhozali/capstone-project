import { StatusKuesioner } from "@/generated/prisma/enums";

export const kuesionerStatusStyles: Record<StatusKuesioner, string> = {
  Draf: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-500",
  Aktif: "bg-green-500/15 text-green-600 dark:text-green-500",
  Ditutup: "bg-neutral-500/15 text-neutral-500",
};
