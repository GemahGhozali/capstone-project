import { CapstoneProjectMonitoringTable } from "@/features/monitoring/components/capstone-project-monitoring-table";
import { getAllMahasiswaCapstoneProjectProgress } from "@/features/monitoring/queries";

export default async function MonitoringPage() {
  const data = await getAllMahasiswaCapstoneProjectProgress();

  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Monitoring Capstone Project</h1>
        <p className="text-muted-foreground text-sm">Pantau progres capstone project dari semua mahasiswa aktif</p>
      </div>
      <CapstoneProjectMonitoringTable data={data} />
    </div>
  );
}
