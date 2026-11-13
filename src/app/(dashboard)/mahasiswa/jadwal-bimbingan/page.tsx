import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconInfoCircle } from "@tabler/icons-react";
import { BookingBimbinganMahasiswaTable } from "@/features/bimbingan/components/booking-bimbingan-mahasiswa-table";
import { getAuthenticatedMahasiswaResume } from "@/features/resume/queries";
import { getBookingBimbinganMahasiswa, getJadwalBimbinganMahasiswa } from "@/features/bimbingan/queries";
import { Callout, CalloutIcon, CalloutContent, CalloutTitle, CalloutDescription, CalloutAction } from "@/components/ui/callout";

export default async function JadwalBimbinganPage() {
  const [mahasiswaResume, bookingBimbinganMahasiswa, jadwalBimbinganMahasiswa] = await Promise.all([
    getAuthenticatedMahasiswaResume(),
    getBookingBimbinganMahasiswa(),
    getJadwalBimbinganMahasiswa(),
  ]);

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
          <CalloutDescription>Jadwal bimbingan akan ditampilkan saat resume anda disetujui dosen pembimbing.</CalloutDescription>
        </CalloutContent>
      </Callout>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Jadwal Bimbingan</h1>
        <p className="text-muted-foreground text-sm">Daftar jadwal bimbingan yang telah anda booking.</p>
      </div>
      <BookingBimbinganMahasiswaTable bookingBimbinganMahasiswa={bookingBimbinganMahasiswa} jadwalBimbinganMahasiswa={jadwalBimbinganMahasiswa} />
    </div>
  );
}
