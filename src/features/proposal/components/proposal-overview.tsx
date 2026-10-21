import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/format-file-size";
import { IconFileDescription } from "@tabler/icons-react";
import { ProposalManagementData } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface ProposalOverviewProps {
  proposal: NonNullable<ProposalManagementData>;
}

export function ProposalOverview({ proposal }: ProposalOverviewProps) {
  return (
    <Card className="p-0 gap-0 divide-y">
      <CardHeader className="p-6">
        <CardTitle>Informasi Proposal</CardTitle>
        <CardDescription>Detail proposal tim capstone project anda</CardDescription>
      </CardHeader>
      <CardContent className="p-6 gap-6">
        <div className="space-y-2">
          <p className="text-muted-foreground">Judul Proposal</p>
          <p className="font-medium">{proposal.judul}</p>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground">Nama Mitra</p>
          <p className="font-medium">{proposal.mitra}</p>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground">File Proposal</p>
          <Empty className="border px-6 py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-secondary text-muted-foreground">
                <IconFileDescription className="size-5" />
              </EmptyMedia>
              <EmptyTitle className="line-clamp-1">{proposal.fileName}</EmptyTitle>
              <EmptyDescription>{formatFileSize(proposal.fileSize)}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link href={proposal.filePath} target="_blank">
                <Button variant="outline">Lihat File</Button>
              </Link>
            </EmptyContent>
          </Empty>
        </div>
      </CardContent>
    </Card>
  );
}
