import { cn } from "cn";
import { CircularProgress } from "@/components/ui/circular-progress";
import { ProposalMonitoring } from "../types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconCircleCheck, IconCircleX, IconClipboardText, IconEdit, IconHourglass } from "@tabler/icons-react";

interface ProposalKPICardsProps {
  data: ProposalMonitoring;
}

export function ProposalKPICards({ data }: ProposalKPICardsProps) {
  const { totalProposal, totalTim } = data;

  const proposalIsNone = totalProposal.keseluruhan === 0;
  const allTeamSubmittedProposal = totalProposal.keseluruhan === totalTim;

  const percentage = totalTim > 0 ? Math.round((totalProposal.keseluruhan / totalTim) * 100) : 0;

  const emptyProposalMessage = `Dari ${totalTim} tim capstone project yang terbentuk, belum ada satupun yang mengumpul proposal`;
  const partialProposalMessage = `Sekitar ${percentage}% atau ${totalProposal.keseluruhan} dari ${totalTim} total tim capstone project telah mengumpulkan proposal`;
  const allProposalMessage = "Semua tim capstone project yang terbentuk sudah mengumpulkan proposal";

  const proposalRatioMessage = proposalIsNone ? emptyProposalMessage : allTeamSubmittedProposal ? allProposalMessage : partialProposalMessage;

  const cardIconBaseClass = "grid size-12 shrink-0 place-content-center rounded-full mb-4";

  return (
    <>
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        <Card className="max-xl:order-2">
          <CardHeader>
            <div className={cn(cardIconBaseClass, "bg-muted text-muted-foreground")}>
              <IconClipboardText />
            </div>
            <CardTitle className="text-lg font-semibold">{totalProposal.keseluruhan} Total</CardTitle>
            <CardDescription>Keseluruhan Proposal Masuk</CardDescription>
          </CardHeader>
        </Card>
        <Card className="max-xl:order-1">
          <CardHeader className="flex flex-col text-center sm:text-left sm:flex-row items-center gap-6">
            <CircularProgress max={totalTim} value={totalProposal.keseluruhan} label="Total Tim" className="shrink-0 size-30" />
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">Rasio Pengumpulan Proposal</CardTitle>
              <CardDescription>{proposalRatioMessage}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <div className={cn(cardIconBaseClass, "bg-blue-500/15 text-blue-500")}>
              <IconHourglass />
            </div>
            <CardTitle className="text-lg font-semibold">{totalProposal.menunggu} Total</CardTitle>
            <CardDescription>Proposal Perlu Direview</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className={cn(cardIconBaseClass, "bg-green-500/15 text-green-500")}>
              <IconCircleCheck />
            </div>
            <CardTitle className="text-lg font-semibold">{totalProposal.disetujui} Total</CardTitle>
            <CardDescription>Proposal Disetujui</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className={cn(cardIconBaseClass, "bg-yellow-500/15 text-yellow-500")}>
              <IconEdit />
            </div>
            <CardTitle className="text-lg font-semibold">{totalProposal.revisi} Total</CardTitle>
            <CardDescription>Proposal Perlu Revisi</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className={cn(cardIconBaseClass, "bg-red-500/15 text-red-500")}>
              <IconCircleX />
            </div>
            <CardTitle className="text-lg font-semibold">{totalProposal.ditolak} Total</CardTitle>
            <CardDescription>Proposal Ditolak</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
