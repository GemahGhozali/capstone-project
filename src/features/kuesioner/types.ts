import {
  getAllKuesioner,
  getKuesionerById,
  getKuesionerWizard,
  getKuesionerStatistic,
  getResponKuesionerDetail,
  getAllKuesionerRespondent,
  getKuesionerListForMahasiswa,
  getKuesionerRespondentExportData,
} from "./queries";

// Kuesioner CRUD
export type KuesionerOverview = Awaited<ReturnType<typeof getAllKuesioner>>[number];
export type KuesionerDetail = Awaited<ReturnType<typeof getKuesionerById>>;
export type BagianKuesioner = NonNullable<KuesionerDetail>["bagian"][number];
export type PertanyaanKuesioner = NonNullable<KuesionerDetail>["bagian"][number]["pertanyaan"][number];

// Mahasiswa Kuesioner Wizard
export type KuesionerMahasiswa = Awaited<ReturnType<typeof getKuesionerListForMahasiswa>>[number];
export type KuesionerWizard = NonNullable<Awaited<ReturnType<typeof getKuesionerWizard>>>;
export type BagianKuesionerWizard = KuesionerWizard["bagian"][number];
export type JawabanKuesionerWizard = KuesionerWizard["jawaban"][number];
export type PertanyaanKuesionerWizard = BagianKuesionerWizard["pertanyaan"][number];

// Kuesioner Respondent
export type KuesionerRespondent = NonNullable<Awaited<ReturnType<typeof getAllKuesionerRespondent>>>["respondent"][number];

// Export Kuesioner Respondent
export type ResponKuesionerDetail = NonNullable<Awaited<ReturnType<typeof getResponKuesionerDetail>>>;
export type KuesionerRespondentExport = NonNullable<Awaited<ReturnType<typeof getKuesionerRespondentExportData>>>;
export type KuesionerRespondentExportRow = KuesionerRespondentExport["rows"][number];
export type KuesionerRespondentExportColumn = KuesionerRespondentExport["columns"][number];

// Kuesioner Statistic
export type KuesionerStatistic = NonNullable<Awaited<ReturnType<typeof getKuesionerStatistic>>>;
