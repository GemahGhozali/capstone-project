import { StatusProposal, WarnaLog } from "@/generated/prisma/enums";

export const proposalStatusColors: Record<StatusProposal, WarnaLog> = {
  Menunggu: "Info",
  Ditolak: "Danger",
  Revisi: "Warning",
  Disetujui: "Success",
};

export function getProposalStatusLogMessage(status: StatusProposal): string {
  if (status === "Disetujui") {
    return "Proposal telah disetujui oleh Dosen Capstone Project";
  }

  if (status === "Revisi") {
    return "Proposal memerlukan revisi sesuai dengan catatan Dosen Capstone Project";
  }

  if (status === "Ditolak") {
    return "Proposal ditolak oleh Dosen Capstone Project";
  }

  return "Proposal sedang dalam proses review oleh Dosen Capstone Project";
}

export const proposalStatusStyles: Record<StatusProposal, string> = {
  Menunggu: "bg-blue-500/15 text-blue-500",
  Revisi: "bg-yellow-500/15 text-yellow-500",
  Disetujui: "bg-green-500/15 text-green-500",
  Ditolak: "bg-red-500/15 text-red-500",
};
