import { ProposalKPICards } from "@/features/monitoring/components/proposal-kpi-cards";
import { RecentProposalList } from "@/features/monitoring/components/recent-proposal-list";
import { getAuthenticatedUserData } from "@/features/auth/queries";
import { getDosenCapstoneProjectDashboardOverview } from "@/features/monitoring/queries";

export default async function DosenCapstoneProjectPage() {
  const [data, user] = await Promise.all([getDosenCapstoneProjectDashboardOverview(), getAuthenticatedUserData()]);

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Selamat Datang, {user.namaLengkap}!👋</h1>
        <p className="text-muted-foreground text-sm">Berikut adalah ringkasan dari keseluruhan proposal yang masuk</p>
      </div>
      <ProposalKPICards data={data} />
      <RecentProposalList data={data} />
    </div>
  );
}
