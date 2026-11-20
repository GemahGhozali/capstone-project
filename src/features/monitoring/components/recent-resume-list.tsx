import Link from "next/link";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconEye, IconFolderOpen } from "@tabler/icons-react";
import { resumeStatusStyles } from "@/features/resume/utils";
import { DosenPembimbingDashboard } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface RecentResumeListProps {
  data: DosenPembimbingDashboard;
}

export function RecentResumeList({ data }: RecentResumeListProps) {
  return (
    <Card>
      <CardHeader className="flex lg:items-end justify-between flex-col lg:flex-row gap-3">
        <div className="space-y-1">
          <CardTitle>Resume Terbaru</CardTitle>
          <CardDescription>Daftar terbaru resume yang masuk</CardDescription>
        </div>
        <Link href="/dosen-pembimbing/resume-masuk" className="max-lg:w-full">
          <Button className="max-lg:w-full">Lihat Semua Resume</Button>
        </Link>
      </CardHeader>
      <CardContent className="gap-6">
        {data.resumeTerbaru.length === 0 ? (
          <Empty className="border">
            <EmptyHeader className="max-w-none!">
              <EmptyMedia variant="icon">
                <IconFolderOpen />
              </EmptyMedia>
              <EmptyTitle>Belum Ada Resume Masuk</EmptyTitle>
              <EmptyDescription>Daftar resume terbaru akan ditampilkan di sini</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          data.resumeTerbaru.map((resume) => (
            <Card key={resume.id} className="p-0 gap-0">
              <CardHeader className="p-4 flex flex-col justify-between lg:items-end lg:flex-row gap-4">
                <div className="space-y-1">
                  <Badge className={cn(resumeStatusStyles[resume.status], "mb-3")}>{resume.status}</Badge>
                  <CardTitle className="line-clamp-1">{resume.subjudul}</CardTitle>
                  <CardDescription className="line-clamp-1">
                    {resume.mahasiswa.nim} - {resume.mahasiswa.namaLengkap}
                  </CardDescription>
                </div>
                <Link href={`/dosen-pembimbing/resume-masuk/${resume.id}/detail`} className="max-lg:w-full">
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
