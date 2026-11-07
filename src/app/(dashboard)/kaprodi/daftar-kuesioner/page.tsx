import { KuesionerTable } from "@/features/kuesioner/components/kuesioner-table";
import { getAllKuesioner } from "@/features/kuesioner/queries";

export default async function DaftarKuesionerPage() {
  const kuesioner = await getAllKuesioner();

  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Daftar Kuesioner</h1>
        <p className="text-muted-foreground text-sm">Semua data kuesioner didalam aplikasi</p>
      </div>
      <KuesionerTable data={kuesioner} />
    </div>
  );
}
