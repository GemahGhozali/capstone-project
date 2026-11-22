import { PenilaianTable } from "@/features/penilaian/components/penilaian-table";
import { getAllPenilaianMahasiswa } from "@/features/penilaian/queries";

export default async function PenilaianMahasiswaPage() {
  const penilaianMahasiswaList = await getAllPenilaianMahasiswa();

  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Penilaian Mahasiswa</h1>
        <p className="text-muted-foreground text-sm">Kelola nilai Capstone Project untuk mahasiswa aktif</p>
      </div>
      <PenilaianTable data={penilaianMahasiswaList} />
    </div>
  );
}
