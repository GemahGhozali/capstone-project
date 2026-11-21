import { ImportMahasiswaRowInput } from "./schemas";
import { getAllMahasiswa, getMahasiswaById } from "./queries";

export type MahasiswaDetails = Awaited<ReturnType<typeof getMahasiswaById>>;
export type MahasiswaOverview = Awaited<ReturnType<typeof getAllMahasiswa>>[number];

export type MahasiswaImportColumn = "nim" | "namaLengkap" | "kodeKelas" | "tanggalMasuk";
export type ParsedMahasiswaImportRow = ImportMahasiswaRowInput & { rowNumber: number };
export type MahasiswaImportRowToCreate = ParsedMahasiswaImportRow & { kelasId: string };

export type ImportMahasiswaRowError = {
  row: number;
  field: string;
  message: string;
};

export type ImportMahasiswaResult = {
  errors?: ImportMahasiswaRowError[];
};
