import { MahasiswaTable } from "@/features/mahasiswa/components/mahasiswa-table";
import { getAllMahasiswa } from "@/features/mahasiswa/queries";

export default async function DaftarMahasiswaPage() {
  const mahasiswa = await getAllMahasiswa();

  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Daftar Mahasiswa</h1>
        <p className="text-muted-foreground text-sm">Semua data mahasiswa didalam aplikasi</p>
      </div>
      <MahasiswaTable data={mahasiswa} />
    </div>
  );
}
