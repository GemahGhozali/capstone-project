import Link from "next/link";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconEye, IconFolderOpen } from "@tabler/icons-react";
import { proposalStatusStyles } from "@/features/proposal/utils";
import { DosenCapstoneProjectDashboard } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface RecentProposalListProps {
  data: DosenCapstoneProjectDashboard;
}

export function RecentProposalList({ data }: RecentProposalListProps) {
  return (
    <Card>
      <CardHeader className="flex lg:items-end justify-between flex-col lg:flex-row gap-3">
        <div className="space-y-1">
          <CardTitle>Proposal Terbaru</CardTitle>
          <CardDescription>Daftar terbaru proposal yang masuk</CardDescription>
        </div>
        <Link href="/dosen-capstone-project/proposal-masuk" className="max-lg:w-full">
          <Button className="max-lg:w-full">Lihat Semua Proposal</Button>
        </Link>
      </CardHeader>
      <CardContent className="gap-6">
        {data.proposalTerbaru.length === 0 ? (
          <Empty className="border">
            <EmptyHeader className="max-w-none!">
              <EmptyMedia variant="icon">
                <IconFolderOpen />
              </EmptyMedia>
              <EmptyTitle>Belum Ada Proposal Masuk</EmptyTitle>
              <EmptyDescription>Daftar proposal terbaru akan ditampilkan di sini</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          data.proposalTerbaru.map((proposal) => (
            <Card key={proposal.id} className="p-0 gap-0">
              <CardHeader className="p-4 flex flex-col justify-between lg:items-end lg:flex-row gap-4">
                <div className="space-y-1">
                  <Badge className={cn(proposalStatusStyles[proposal.status], "mb-3")}>{proposal.status}</Badge>
                  <CardTitle className="line-clamp-1">{proposal.judul}</CardTitle>
                  <CardDescription className="line-clamp-1">{proposal.namaTim}</CardDescription>
                </div>
                <Link href={`/dosen-capstone-project/proposal-masuk/${proposal.id}/detail`} className="max-lg:w-full">
                  <Button variant="outline" size="sm" className="max-lg:w-full">
                    <IconEye stroke={1.75} data-icon="inline-start" />
                    Lihat Detail
                  </Button>
                </Link>
              </CardHeader>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
}
