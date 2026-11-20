import { notFound } from "next/navigation";
import { BimbinganMahasiswaTable } from "@/features/bimbingan/components/bimbingan-mahasiswa-table";
import { BimbinganMahasiswaKPICards } from "@/features/bimbingan/components/bimbingan-mahasiswa-kpi-cards";
import { getMahasiswaWithBimbinganList } from "@/features/bimbingan/queries";
import { ResumeAndDosenPembimbingInformation } from "@/features/bimbingan/components/resume-and-dosen-pembimbing-information";

type MonitoringBimbinganDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MonitoringBimbinganDetailPage({ params }: MonitoringBimbinganDetailPageProps) {
  const { id } = await params;

  const mahasiswa = await getMahasiswaWithBimbinganList(id);

  if (!mahasiswa) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">
          {mahasiswa.namaLengkap} - {mahasiswa.nim}
        </h1>
        <p className="text-muted-foreground text-sm">Seluruh riwayat catatan dan bukti pendukung bimbingan mahasiswa.</p>
      </div>
      <ResumeAndDosenPembimbingInformation subjudulResume={mahasiswa.subjudulResume} dosenPembimbing={mahasiswa.dosenPembimbing} />
      <BimbinganMahasiswaKPICards data={mahasiswa.bimbingan.total} />
      <BimbinganMahasiswaTable data={mahasiswa.bimbingan.list} viewer="Kaprodi" />
    </div>
  );
}
