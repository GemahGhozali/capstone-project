import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/format-file-size";
import { IconFileDescription } from "@tabler/icons-react";
import { ResumeManagementData } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface ResumeOverviewProps {
  resume: NonNullable<ResumeManagementData>;
}

export function ResumeOverview({ resume }: ResumeOverviewProps) {
  return (
    <Card className="p-0 gap-0 divide-y">
      <CardHeader className="p-6">
        <CardTitle>Informasi Resume</CardTitle>
        <CardDescription>Detail resume dan dosen pembimbing anda</CardDescription>
      </CardHeader>
      <CardContent className="p-6 gap-6">
        <div className="space-y-2">
          <p className="text-muted-foreground">Subjudul Proposal</p>
          <p className="font-medium">{resume.subjudul}</p>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground">Dosen Pembimbing</p>
          <p className="font-medium">{resume.dosen.namaLengkap}</p>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground">File Resume</p>
          <Empty className="border px-6 py-8">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-secondary text-muted-foreground">
                <IconFileDescription className="size-5" />
              </EmptyMedia>
              <EmptyTitle className="line-clamp-1">{resume.fileName}</EmptyTitle>
              <EmptyDescription>{formatFileSize(resume.fileSize)}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Link href={resume.filePath} target="_blank">
                <Button variant="outline">Lihat File</Button>
              </Link>
            </EmptyContent>
          </Empty>
        </div>
      </CardContent>
    </Card>
  );
}
