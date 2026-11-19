import { getListBimbinganDosenPembimbing, getMahasiswaBimbinganManagementData, getMahasiswaWithBimbinganList } from "./queries";

export type BimbinganManagementData = Awaited<ReturnType<typeof getMahasiswaBimbinganManagementData>>;
export type BimbinganMahasiswa = BimbinganManagementData["bimbingan"][number];
export type BimbinganMahasiswaDetail = NonNullable<Awaited<ReturnType<typeof getMahasiswaWithBimbinganList>>>;
export type BimbinganDosenPembimbing = Awaited<ReturnType<typeof getListBimbinganDosenPembimbing>>[number];
