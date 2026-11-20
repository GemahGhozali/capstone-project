import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ResumeAndDosenPembimbingInformationProps {
  subjudulResume?: string;
  dosenPembimbing?: string;
}

export function ResumeAndDosenPembimbingInformation({ subjudulResume, dosenPembimbing }: ResumeAndDosenPembimbingInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subjudul Resume</CardTitle>
        <CardDescription className={cn(!subjudulResume && "italic")}>
          {subjudulResume ?? "Mahasiswa belum melakukan upload resume dan pengajuan dosen pembimbing"}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardFooter className="gap-1.5 items-start sm:justify-between max-sm:flex-col">
        <CardDescription className="text-foreground font-medium flex items-center gap-1.5">Dosen Pembimbing :</CardDescription>
        {dosenPembimbing ? (
          <CardDescription>{dosenPembimbing}</CardDescription>
        ) : (
          <Badge className="bg-neutral-500/15 text-neutral-500">Belum Ditentukan</Badge>
        )}
      </CardFooter>
    </Card>
  );
}
