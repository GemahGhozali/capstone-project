import { ProposalKPICards } from "@/features/monitoring/components/proposal-kpi-cards";
import { ProposalRecentList } from "@/features/monitoring/components/proposal-recent-list";
import { getAuthenticatedUserData } from "@/features/auth/queries";
import { getProposalMonitoringOverview } from "@/features/monitoring/queries";

export default async function DosenCapstoneProjectPage() {
  const [data, user] = await Promise.all([getProposalMonitoringOverview(), getAuthenticatedUserData()]);

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Selamat Datang, {user.namaLengkap}!👋</h1>
        <p className="text-muted-foreground text-sm">Berikut adalah ringkasan dari keseluruhan proposal yang masuk</p>
      </div>
      <ProposalKPICards data={data} />
      <ProposalRecentList data={data} />
    </div>
  );
}
