import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/format-file-size";
import { IconFileDescription } from "@tabler/icons-react";
import { generateNameInitials } from "@/utils/generate-name-initials";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ResumeDetail, ResumeManagementData, ResumeViewer } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface ResumeOverviewProps {
  resume: NonNullable<ResumeManagementData>;
  viewer: ResumeViewer;
  mahasiswa?: NonNullable<ResumeDetail>["mahasiswa"];
}

export function ResumeOverview({ resume, mahasiswa, viewer }: ResumeOverviewProps) {
  return (
    <Card className="p-0 gap-0 divide-y">
      <CardHeader className="p-6">
        <CardTitle>Informasi Resume</CardTitle>
        <CardDescription>
          {viewer === "Mahasiswa"
            ? "Detail mitra, proposal, resume dan dosen pembimbing anda"
            : viewer === "Dosen"
              ? "Detail mitra, proposal dan resume dari mahasiswa"
              : "Detail mitra, proposal, resume dan dosen pembimbing mahasiswa"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 gap-6">
        <div className="space-y-2">
          <p className="text-muted-foreground">Mitra</p>
          <p className="font-medium">{resume.proposal.mitra}</p>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground">Judul Proposal</p>
          <p className="font-medium">{resume.proposal.judul}</p>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground">Subjudul Resume</p>
          <p className="font-medium">{resume.subjudul}</p>
        </div>
        {mahasiswa && (
          <div className="space-y-2">
            <p className="text-muted-foreground">Mahasiswa</p>
            <Card>
              <CardContent className="flex-row items-center gap-3 relative">
                <div className="flex gap-3 md:items-center max-md:flex-col">
                  <Avatar size="lg">
                    <AvatarImage src={mahasiswa.fotoProfil ?? ""} alt={mahasiswa.namaLengkap} />
                    <AvatarFallback>{generateNameInitials(mahasiswa.namaLengkap)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="font-medium">{mahasiswa.namaLengkap}</p>
                    <p className="text-muted-foreground">{mahasiswa.nim}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="h-6 ml-auto max-md:absolute max-md:top-0 max-md:right-6">
                  {mahasiswa.kategoriCapstone}
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}
        {viewer !== "Dosen" && (
          <div className="space-y-2">
            <p className="text-muted-foreground">Dosen Pembimbing</p>
            <Card>
              <CardContent className="flex-row items-center">
                <div className="flex gap-3 md:items-center max-md:flex-col">
                  <Avatar size="lg">
                    <AvatarImage src={resume.dosen.fotoProfil ?? ""} alt={resume.dosen.namaLengkap} />
                    <AvatarFallback>{generateNameInitials(resume.dosen.namaLengkap)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="font-medium">{resume.dosen.namaLengkap}</p>
                    <p className="text-muted-foreground">{resume.dosen.nip}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
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
