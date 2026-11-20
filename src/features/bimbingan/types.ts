import { getListBimbinganDosenPembimbing, getListBimbinganMahasiswa, getMahasiswaWithBimbinganList } from "./queries";

export type BimbinganMahasiswaViewer = "Mahasiswa" | "Kaprodi";
export type BimbinganManagementData = Awaited<ReturnType<typeof getListBimbinganMahasiswa>>;
export type BimbinganMahasiswa = Awaited<ReturnType<typeof getListBimbinganMahasiswa>>[number];
export type BimbinganMahasiswaDetail = NonNullable<Awaited<ReturnType<typeof getMahasiswaWithBimbinganList>>>;
export type BimbinganDosenPembimbing = Awaited<ReturnType<typeof getListBimbinganDosenPembimbing>>[number];
