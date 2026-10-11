import { DosenTable } from "@/features/dosen/components/dosen-table";
import { getAllDosen } from "@/features/dosen/queries";

export default async function DaftarDosenPage() {
  const dosen = await getAllDosen();

  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Daftar Dosen</h1>
        <p className="text-muted-foreground text-sm">Semua data dosen didalam aplikasi</p>
      </div>
      <DosenTable data={dosen} />
    </div>
  );
}
