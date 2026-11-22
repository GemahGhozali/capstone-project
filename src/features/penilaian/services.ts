import "server-only";

import { prisma } from "@/libs/prisma";
import { ImportPenilaianRowSchema } from "./schemas";
import { normalizeExcelCellValue, type ExcelDataRow } from "@/libs/excel";
import { ImportPenilaianRowError, PenilaianImportColumn, PenilaianImportRowToApply, ParsedPenilaianImportRow } from "./types";

function parseAndValidateImportRows(
  rows: ExcelDataRow[],
  columnIndexes: Record<PenilaianImportColumn, number>,
): { parsedRows: ParsedPenilaianImportRow[]; rowErrors: ImportPenilaianRowError[] } {
  const parsedRows: ParsedPenilaianImportRow[] = [];
  const rowErrors: ImportPenilaianRowError[] = [];

  for (const { cells, rowNumber } of rows) {
    const rowCandidate = {
      nim: normalizeExcelCellValue(cells[columnIndexes.nim]),
      nilai: normalizeExcelCellValue(cells[columnIndexes.nilai]),
    };

    const parsedRow = ImportPenilaianRowSchema.safeParse(rowCandidate);

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

function findDuplicateNimInFile(parsedRows: ParsedPenilaianImportRow[]): ImportPenilaianRowError[] {
  const rowErrors: ImportPenilaianRowError[] = [];
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

async function resolveMahasiswaIds(
  parsedRows: ParsedPenilaianImportRow[],
): Promise<{ rowsToApply: PenilaianImportRowToApply[]; rowErrors: ImportPenilaianRowError[] }> {
  const rowErrors: ImportPenilaianRowError[] = [];
  const rowsToApply: PenilaianImportRowToApply[] = [];

  const nimList = parsedRows.map((row) => row.nim);

  const mahasiswaList = await prisma.mahasiswa.findMany({
    where: { nim: { in: nimList } },
    select: { id: true, nim: true, status: true },
  });

  const mahasiswaIdByNim = new Map(mahasiswaList.map((mahasiswa) => [mahasiswa.nim, mahasiswa]));

  for (const row of parsedRows) {
    const mahasiswa = mahasiswaIdByNim.get(row.nim);

    if (!mahasiswa) {
      rowErrors.push({
        row: row.rowNumber,
        field: "NIM",
        message: "NIM mahasiswa tidak ditemukan di dalam sistem!",
      });

      continue;
    }

    const mahasiswaNotActive = mahasiswa.status !== "Aktif" && mahasiswa.status !== "Tuntas";

    if (mahasiswaNotActive) {
      rowErrors.push({
        row: row.rowNumber,
        field: "NIM",
        message: "NIM bukan berasal dari mahasiswa yang berstatus Aktif/Tuntas!",
      });

      continue;
    }

    rowsToApply.push({ ...row, mahasiswaId: mahasiswa.id });
  }

  return { rowsToApply, rowErrors };
}

export async function preparePenilaianImportRows(
  rows: ExcelDataRow[],
  columnIndexes: Record<PenilaianImportColumn, number>,
): Promise<{ rowsToApply: PenilaianImportRowToApply[]; rowErrors: ImportPenilaianRowError[] }> {
  const { parsedRows, rowErrors: parseErrors } = parseAndValidateImportRows(rows, columnIndexes);

  const rowErrors = [...parseErrors, ...findDuplicateNimInFile(parsedRows)];

  const { rowsToApply, rowErrors: mahasiswaErrors } = await resolveMahasiswaIds(parsedRows);

  rowErrors.push(...mahasiswaErrors);

  return { rowsToApply, rowErrors };
}

export async function applyPenilaianImport(rowsToApply: PenilaianImportRowToApply[]) {
  const mahasiswaIds = rowsToApply.map((row) => row.mahasiswaId);

  await prisma.$transaction(async (transaction) => {
    for (const row of rowsToApply) {
      await transaction.penilaian.upsert({
        where: { mahasiswaId: row.mahasiswaId },
        create: { mahasiswaId: row.mahasiswaId, nilai: row.nilai },
        update: { nilai: row.nilai },
      });
    }

    await transaction.mahasiswa.updateMany({
      where: { id: { in: mahasiswaIds }, status: "Aktif" },
      data: { status: "Tuntas" },
    });
  });
}
