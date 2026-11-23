import { IconInfoCircle } from "@tabler/icons-react";
import { CircularProgress } from "@/components/ui/circular-progress";
import { getPenilaianAuthenticatedMahasiswa } from "../queries";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Callout, CalloutContent, CalloutDescription, CalloutIcon, CalloutTitle } from "@/components/ui/callout";

export async function PenilaianMahasiswaDisplay() {
  const mahasiswa = await getPenilaianAuthenticatedMahasiswa();

  const mahasiswaAlreadyGraded = mahasiswa.nilai !== null;

  if (!mahasiswa.hasFilledKuesioner) {
    return (
      <Callout>
        <CalloutIcon className="bg-blue-500/15 text-blue-500">
          <IconInfoCircle />
        </CalloutIcon>
        <CalloutContent>
          <CalloutTitle>Nilai Anda Belum Dapat Ditampilkan!</CalloutTitle>
          <CalloutDescription>Silahkan mengisi kuesioner terlebih dahulu untuk melihat nilai Anda.</CalloutDescription>
        </CalloutContent>
      </Callout>
    );
  }

  return (
    <Card>
      <CardHeader className="flex gap-6 items-center max-sm:flex-col">
        <CircularProgress
          max={100}
          value={mahasiswa.nilai ?? 0}
          label="Total Nilai"
          className="size-24 [&>div]:scale-[0.72] [&>div]:w-full shrink-0"
        />
        <div className="space-y-1 max-sm:text-center">
          <CardTitle>{mahasiswaAlreadyGraded ? "Nilai Capstone Project Anda" : "Nilai Anda Belum Tersedia!"}</CardTitle>
          <CardDescription>
            {mahasiswaAlreadyGraded
              ? "Nilai ini merupakan akumulasi penilaian dari keseluruhan capstone project anda."
              : "Nilai anda masih dalam proses evaluasi! Silakan periksa halaman ini secara berkala."}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
