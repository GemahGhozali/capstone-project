import { getAuthenticatedUserData } from "@/features/auth/queries";
import { getDosenPembimbingDashboardOverview } from "@/features/monitoring/queries";
import { DosenPembimbingKPICards } from "@/features/monitoring/components/dosen-pembimbing-kpi-cards";
import { RecentResumeList } from "@/features/monitoring/components/recent-resume-list";
import { PendingBimbinganList } from "@/features/monitoring/components/pending-bimbingan-list";

export default async function DosenPembimbingPage() {
  const [data, user] = await Promise.all([getDosenPembimbingDashboardOverview(), getAuthenticatedUserData()]);

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Selamat Datang, {user.namaLengkap}!</h1>
        <p className="text-muted-foreground text-sm">Berikut adalah ringkasan aktivitas bimbingan dan resume mahasiswa anda</p>
      </div>
      <DosenPembimbingKPICards data={data} />
      <RecentResumeList data={data} />
      <PendingBimbinganList data={data} />
    </div>
  );
}
