import { getAllTeam, getTeamById, searchInvitableMahasiswa } from "./queries";

export type SearchMahasiswaResult = Awaited<ReturnType<typeof searchInvitableMahasiswa>>[number];

export type TeamCompletenessStatus = "Lengkap" | "Belum Lengkap";
export type TeamListItem = Awaited<ReturnType<typeof getAllTeam>>[number];
export type TeamDetail = NonNullable<Awaited<ReturnType<typeof getTeamById>>>;
