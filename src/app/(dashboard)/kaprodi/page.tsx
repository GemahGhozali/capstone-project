import { KaprodiKPICards } from "@/features/monitoring/components/kaprodi-kpi-cards";
import { getAuthenticatedUserData } from "@/features/auth/queries";
import { getKaprodiDashboardOverview } from "@/features/monitoring/queries";

export default async function KaprodiPage() {
  const [data, user] = await Promise.all([getKaprodiDashboardOverview(), getAuthenticatedUserData()]);

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Selamat Datang, {user.namaLengkap}!</h1>
        <p className="text-muted-foreground text-sm">Berikut adalah ringkasan keseluruhan data Capstone Project</p>
      </div>
      <KaprodiKPICards data={data} />
    </div>
  );
}
