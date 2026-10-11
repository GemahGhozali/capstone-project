import { getAllMahasiswa, getMahasiswaById } from "./queries";

export type MahasiswaDetails = Awaited<ReturnType<typeof getMahasiswaById>>;
export type MahasiswaOverview = Awaited<ReturnType<typeof getAllMahasiswa>>[number];
