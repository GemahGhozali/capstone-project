import { getProposalMonitoringOverview } from "./queries";

export type ProposalMonitoring = Awaited<ReturnType<typeof getProposalMonitoringOverview>>;
