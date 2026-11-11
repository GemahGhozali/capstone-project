import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { IconInfoCircle } from "@tabler/icons-react";
import { KuesionerWizard } from "@/features/kuesioner/components/fill-kuesioner-wizard";
import { getKuesionerWizard } from "@/features/kuesioner/queries";
import { KuesionerResponseOverview } from "@/features/kuesioner/components/kuesioner-response-overview";
import { getAuthenticatedMahasiswaResume } from "@/features/resume/queries";
import { Callout, CalloutIcon, CalloutContent, CalloutTitle, CalloutDescription, CalloutAction } from "@/components/ui/callout";

type KuesionerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function KuesionerDetailPage({ params }: KuesionerDetailPageProps) {
  const { id } = await params;

  const [mahasiswaResume, kuesioner] = await Promise.all([getAuthenticatedMahasiswaResume(), getKuesionerWizard(id)]);

  if (!kuesioner) notFound();

  if (!mahasiswaResume) {
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

  if (mahasiswaResume.status !== "Disetujui") {
    return (
      <Callout>
        <CalloutIcon className="bg-blue-500/15 text-blue-500">
          <IconInfoCircle />
        </CalloutIcon>
        <CalloutContent>
          <CalloutTitle>Resume Anda Belum Disetujui!</CalloutTitle>
          <CalloutDescription>Kuesioner akan ditampilkan saat resume anda telah disetujui.</CalloutDescription>
        </CalloutContent>
      </Callout>
    );
  }

  const kuesionerIsLocked = kuesioner.isComplete || kuesioner.status === "Ditutup";

  if (kuesionerIsLocked) {
    return <KuesionerResponseOverview kuesioner={kuesioner} />;
  }

  return <KuesionerWizard kuesioner={kuesioner} />;
}
