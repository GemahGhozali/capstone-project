import { BimbinganMonitoringTable } from "@/features/monitoring/components/bimbingan-monitoring-table";
import { getAllBimbinganMahasiswaMonitoring } from "@/features/monitoring/queries";

export default async function MonitoringBimbinganPage() {
  const data = await getAllBimbinganMahasiswaMonitoring();

  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Monitoring Bimbingan</h1>
        <p className="text-muted-foreground text-sm">Pantau jumlah bimbingan terverifikasi dari mahasiswa aktif.</p>
      </div>
      <BimbinganMonitoringTable data={data} />
    </div>
  );
}
