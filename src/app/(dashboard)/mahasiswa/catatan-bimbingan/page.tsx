import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconInfoCircle } from "@tabler/icons-react";
import { BimbinganMahasiswaTable } from "@/features/bimbingan/components/bimbingan-mahasiswa-table";
import { getListBimbinganMahasiswa } from "@/features/bimbingan/queries";
import { getAuthenticatedMahasiswaResume } from "@/features/resume/queries";
import { Callout, CalloutIcon, CalloutContent, CalloutTitle, CalloutDescription, CalloutAction } from "@/components/ui/callout";

export default async function BimbinganPage() {
  const [resume, bimbingan] = await Promise.all([getAuthenticatedMahasiswaResume(), getListBimbinganMahasiswa()]);

  if (!resume) {
    return (
      <Callout>
        <CalloutIcon className="bg-blue-500/15 text-blue-500">
          <IconInfoCircle />
        </CalloutIcon>
        <CalloutContent>
          <CalloutTitle>Anda Belum Upload Resume!</CalloutTitle>
          <CalloutDescription>Silahkan upload resume anda terlebih dahulu.</CalloutDescription>
        </CalloutContent>
        <CalloutAction
          render={
            <Link href="/mahasiswa/upload-resume" className="w-full">
              <Button className="w-full">Upload Resume</Button>
            </Link>
          }
        />
      </Callout>
    );
  }

  const resumeIsNotApproved = resume.status !== "Disetujui" && resume.status !== "Arsip";

  if (resumeIsNotApproved) {
    return (
      <Callout>
        <CalloutIcon className="bg-blue-500/15 text-blue-500">
          <IconInfoCircle />
        </CalloutIcon>
        <CalloutContent>
          <CalloutTitle>Resume Anda Belum Disetujui!</CalloutTitle>
          <CalloutDescription>Bimbingan akan terbuka saat resume anda disetujui dosen pembimbing.</CalloutDescription>
        </CalloutContent>
      </Callout>
    );
  }

  return <BimbinganMahasiswaTable data={bimbingan} />;
}
