import { searchInvitableMahasiswa } from "./queries";

export type SearchMahasiswaResult = Awaited<ReturnType<typeof searchInvitableMahasiswa>>[number];
