import { ProdiTable } from "@/features/prodi/components/prodi-table";
import { getAllProdi } from "@/features/prodi/queries";

export default async function DaftarProgramStudiPage() {
  const prodi = await getAllProdi();

  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Daftar Program Studi</h1>
        <p className="text-muted-foreground text-sm">Semua data program studi didalam aplikasi</p>
      </div>
      <ProdiTable data={prodi} />
    </div>
  );
}
