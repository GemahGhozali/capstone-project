import { BimbinganDosenTable } from "@/features/bimbingan/components/bimbingan-dosen-table";
import { getListBimbinganDosenPembimbing } from "@/features/bimbingan/queries";

export default async function BimbinganMahasiswaPage() {
  const data = await getListBimbinganDosenPembimbing();

  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Bimbingan Mahasiswa</h1>
        <p className="text-muted-foreground text-sm">Verifikasi catatan dan bukti pendukung bimbingan mahasiswa anda.</p>
      </div>
      <BimbinganDosenTable data={data} />
    </div>
  );
}
