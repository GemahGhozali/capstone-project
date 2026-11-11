import Link from "next/link";
import { Button } from "@/components/ui/button";
import { KuesionerList } from "@/features/kuesioner/components/kuesioner-list";
import { IconInfoCircle, IconMessage } from "@tabler/icons-react";
import { getKuesionerListForMahasiswa } from "@/features/kuesioner/queries";
import { getAuthenticatedMahasiswaResume } from "@/features/resume/queries";
import { Callout, CalloutIcon, CalloutContent, CalloutTitle, CalloutDescription, CalloutAction } from "@/components/ui/callout";

export default async function PengisianKuesionerPage() {
  const [mahasiswaResume, kuesionerList] = await Promise.all([getAuthenticatedMahasiswaResume(), getKuesionerListForMahasiswa()]);

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

  if (kuesionerList.length === 0) {
    return (
      <Callout>
        <CalloutIcon className="bg-blue-500/15 text-blue-500">
          <IconMessage />
        </CalloutIcon>
        <CalloutContent>
          <CalloutTitle>Kuesioner Belum Tersedia!</CalloutTitle>
          <CalloutDescription>Daftar kuesioner akan ditampilkan disini setelah resmi dipublikasikan</CalloutDescription>
        </CalloutContent>
      </Callout>
    );
  }

  return <KuesionerList kuesionerList={kuesionerList} />;
}
