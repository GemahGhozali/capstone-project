import { getAllKuesioner, getKuesionerById, getKuesionerListForMahasiswa, getKuesionerWizard } from "./queries";

export type KuesionerOverview = Awaited<ReturnType<typeof getAllKuesioner>>[number];
export type KuesionerDetail = Awaited<ReturnType<typeof getKuesionerById>>;
export type BagianKuesioner = NonNullable<KuesionerDetail>["bagian"][number];
export type PertanyaanKuesioner = NonNullable<KuesionerDetail>["bagian"][number]["pertanyaan"][number];

export type KuesionerMahasiswa = Awaited<ReturnType<typeof getKuesionerListForMahasiswa>>[number];
export type KuesionerWizard = NonNullable<Awaited<ReturnType<typeof getKuesionerWizard>>>;
export type BagianKuesionerWizard = KuesionerWizard["bagian"][number];
export type JawabanKuesionerWizard = KuesionerWizard["jawaban"][number];
export type PertanyaanKuesionerWizard = BagianKuesionerWizard["pertanyaan"][number];
