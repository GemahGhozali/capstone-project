import { StatusResume, WarnaLog } from "@/generated/prisma/enums";

export const resumeStatusColors: Record<StatusResume, WarnaLog> = {
  Menunggu: "Info",
  Disetujui: "Success",
  Ditolak: "Danger",
};

export function getResumeStatusLogMessage(status: StatusResume): string {
  if (status === "Disetujui") {
    return "Resume telah disetujui oleh Dosen Pembimbing";
  }

  if (status === "Ditolak") {
    return "Resume ditolak oleh Dosen Pembimbing";
  }

  return "Resume sedang dalam proses review oleh Dosen Pembimbing";
}

export const resumeStatusStyles: Record<StatusResume, string> = {
  Menunggu: "bg-blue-500/15 text-blue-500",
  Disetujui: "bg-green-500/15 text-green-500",
  Ditolak: "bg-red-500/15 text-red-500",
};
