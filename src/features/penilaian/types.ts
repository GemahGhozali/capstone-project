import { ImportPenilaianRowInput } from "./schemas";
import { getAllPenilaianMahasiswa } from "./queries";

export type NilaiMahasiswa = Awaited<ReturnType<typeof getAllPenilaianMahasiswa>>[number];

export type PenilaianImportColumn = "nim" | "nilai";
export type ParsedPenilaianImportRow = ImportPenilaianRowInput & { rowNumber: number };
export type PenilaianImportRowToApply = ParsedPenilaianImportRow & { mahasiswaId: string };

export type ImportPenilaianRowError = {
  row: number;
  field: string;
  message: string;
};

export type ImportPenilaianResult = {
  errors?: ImportPenilaianRowError[];
};
