import "server-only";

import { prisma } from "@/libs/prisma";
import { ImportMahasiswaRowSchema } from "./schemas";
import { normalizeExcelCellValue, parseExcelDate, type ExcelDataRow } from "@/libs/excel";
import { ImportMahasiswaRowError, MahasiswaImportColumn, MahasiswaImportRowToCreate, ParsedMahasiswaImportRow } from "./types";

function generateMahasiswaDefaultEmail(nim: string): string {
  return `${nim}@gmail.com`;
}

function parseAndValidateImportRows(
  rows: ExcelDataRow[],
  columnIndexes: Record<MahasiswaImportColumn, number>,
): { parsedRows: ParsedMahasiswaImportRow[]; rowErrors: ImportMahasiswaRowError[] } {
  const parsedRows: ParsedMahasiswaImportRow[] = [];
  const rowErrors: ImportMahasiswaRowError[] = [];

  for (const { cells, rowNumber } of rows) {
    const rowCandidate = {
      nim: normalizeExcelCellValue(cells[columnIndexes.nim]),
      namaLengkap: normalizeExcelCellValue(cells[columnIndexes.namaLengkap]),
      kodeKelas: normalizeExcelCellValue(cells[columnIndexes.kodeKelas]),
      tanggalMasuk: parseExcelDate(cells[columnIndexes.tanggalMasuk]),
    };

    const parsedRow = ImportMahasiswaRowSchema.safeParse(rowCandidate);

    if (!parsedRow.success) {
      for (const issue of parsedRow.error.issues) {
        rowErrors.push({
          row: rowNumber,
          field: String(issue.path[0] ?? ""),
          message: issue.message,
        });
      }

      continue;
    }

    parsedRows.push({ ...parsedRow.data, rowNumber });
  }

  return { parsedRows, rowErrors };
}

function findDuplicateNimInFile(parsedRows: ParsedMahasiswaImportRow[]): ImportMahasiswaRowError[] {
  const rowErrors: ImportMahasiswaRowError[] = [];
  const nimRowNumbers = new Map<string, number>();

  for (const row of parsedRows) {
    const existingRowNumber = nimRowNumbers.get(row.nim);

    if (existingRowNumber !== undefined) {
      rowErrors.push({
        row: row.rowNumber,
        field: "NIM",
        message: `NIM duplikat di dalam file (sama dengan baris ${existingRowNumber}).`,
      });

      continue;
    }

    nimRowNumbers.set(row.nim, row.rowNumber);
  }

  return rowErrors;
}

async function findDuplicateNimInDatabase(parsedRows: ParsedMahasiswaImportRow[]): Promise<ImportMahasiswaRowError[]> {
  const rowErrors: ImportMahasiswaRowError[] = [];

  const nimList = parsedRows.map((row) => row.nim);

  const existingAccounts = await prisma.user.findMany({
    where: { identifier: { in: nimList } },
    select: { identifier: true },
  });

  const existingNim = new Set(existingAccounts.map((account) => account.identifier));

  for (const row of parsedRows) {
    if (existingNim.has(row.nim)) {
      rowErrors.push({
        row: row.rowNumber,
        field: "NIM",
        message: "NIM sudah terdaftar di dalam aplikasi!",
      });
    }
  }

  return rowErrors;
}

async function resolveKelasIds(
  parsedRows: ParsedMahasiswaImportRow[],
): Promise<{ rowsToCreate: MahasiswaImportRowToCreate[]; rowErrors: ImportMahasiswaRowError[] }> {
  const rowErrors: ImportMahasiswaRowError[] = [];
  const rowsToCreate: MahasiswaImportRowToCreate[] = [];

  const kelasList = await prisma.kelas.findMany({ select: { id: true, kode: true } });
  const kelasIdByKode = new Map(kelasList.map((kelas) => [kelas.kode.trim().toUpperCase(), kelas.id]));

  for (const row of parsedRows) {
    const kelasId = kelasIdByKode.get(row.kodeKelas.trim().toUpperCase());

    if (!kelasId) {
      rowErrors.push({
        row: row.rowNumber,
        field: "Kode Kelas",
        message: `Kode kelas "${row.kodeKelas}" tidak ditemukan! Lihat sheet Daftar Kelas.`,
      });

      continue;
    }

    rowsToCreate.push({ ...row, kelasId });
  }

  return { rowsToCreate, rowErrors };
}

export async function prepareMahasiswaImportRows(
  rows: ExcelDataRow[],
  columnIndexes: Record<MahasiswaImportColumn, number>,
): Promise<{ rowsToCreate: MahasiswaImportRowToCreate[]; rowErrors: ImportMahasiswaRowError[] }> {
  const { parsedRows, rowErrors: parseErrors } = parseAndValidateImportRows(rows, columnIndexes);

  const rowErrors = [...parseErrors, ...findDuplicateNimInFile(parsedRows), ...(await findDuplicateNimInDatabase(parsedRows))];

  const { rowsToCreate, rowErrors: kelasErrors } = await resolveKelasIds(parsedRows);

  rowErrors.push(...kelasErrors);

  return { rowsToCreate, rowErrors };
}

export async function createImportedMahasiswaAccounts(
  rowsToCreate: MahasiswaImportRowToCreate[],
  hashedPasswords: string[],
  mahasiswaRoleId: string,
) {
  await prisma.$transaction(
    rowsToCreate.map((row, index) =>
      prisma.user.create({
        data: {
          namaLengkap: row.namaLengkap,
          alamatEmail: generateMahasiswaDefaultEmail(row.nim),
          identifier: row.nim,
          password: hashedPasswords[index],
          fotoProfil: null,
          isActive: true,
          mahasiswa: {
            create: {
              nim: row.nim,
              tanggalMasuk: row.tanggalMasuk,
              kelasId: row.kelasId,
              status: "Aktif",
            },
          },
          userRoles: { create: { roleId: mahasiswaRoleId } },
        },
      }),
    ),
  );
}
