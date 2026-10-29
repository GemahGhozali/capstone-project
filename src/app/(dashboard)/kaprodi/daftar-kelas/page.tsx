import { KelasTable } from "@/features/kelas/components/kelas-table";
import { getAllKelas } from "@/features/kelas/queries";

export default async function DaftarKelasPage() {
  const kelas = await getAllKelas();

  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Daftar Kelas</h1>
        <p className="text-muted-foreground text-sm">Semua data kelas didalam aplikasi</p>
      </div>
      <KelasTable data={kelas} />
    </div>
  );
}
