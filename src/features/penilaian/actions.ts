"use server";

import { prisma } from "@/libs/prisma";
import { formatZodError } from "@/utils/format-zod-error";
import { ActionResponse } from "@/types";
import { userIsValidAndHasRole } from "@/libs/dal";
import { ImportPenilaianResult, PenilaianImportColumn } from "./types";
import { applyPenilaianImport, preparePenilaianImportRows } from "./services";
import { PenilaianInput, ImportPenilaianInput, PenilaianSchema, ImportPenilaianSchema } from "./schemas";
import { ExcelReadError, getFilledExcelRows, normalizeExcelCellValue, readExcelSheet, resolveExcelColumnIndexes, ExcelSheetRows } from "@/libs/excel";

export async function setPenilaianMahasiswa(data: PenilaianInput): Promise<ActionResponse> {
  const parsed = PenilaianSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { mahasiswaId, nilai } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    // Validasi 1 : Cek apakah data mahasiswa ditemukan
    const mahasiswa = await prisma.mahasiswa.findUnique({ where: { id: mahasiswaId }, select: { id: true, status: true } });

    if (!mahasiswa) {
      return { success: false, message: "Data mahasiswa tidak ditemukan!" };
    }

    // Validasi 2 : Hanya mahasiswa Aktif/Tuntas yang boleh dinilai
    const mahasiswaCannotBeGraded = mahasiswa.status !== "Aktif" && mahasiswa.status !== "Tuntas";

    if (mahasiswaCannotBeGraded) {
      return { success: false, message: "Hanya mahasiswa berstatus Aktif atau Tuntas yang bisa dinilai!" };
    }

    await prisma.$transaction(async (transaction) => {
      // Simpan atau perbaharui nilai mahasiswa
      await transaction.penilaian.upsert({
        where: { mahasiswaId },
        create: { mahasiswaId, nilai },
        update: { nilai },
      });

      // Set status mahasiswa menjadi Tuntas jika sebelumnya masih Aktif
      if (mahasiswa.status === "Aktif") {
        await transaction.mahasiswa.update({ where: { id: mahasiswaId }, data: { status: "Tuntas" } });
      }
    });

    return { success: true, message: "Nilai mahasiswa berhasil disimpan!" };
  } catch (error) {
    console.log("❌ Set Penilaian Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function deletePenilaianMahasiswa(mahasiswaId: string): Promise<ActionResponse> {
  try {
    await userIsValidAndHasRole("Kaprodi");

    // Validasi 1 : Cek apakah mahasiswa sudah memiliki nilai
    const penilaian = await prisma.penilaian.findUnique({ where: { mahasiswaId }, select: { id: true } });

    if (!penilaian) {
      return { success: false, message: "Mahasiswa ini belum memiliki nilai!" };
    }

    await prisma.$transaction([
      // Hapus nilai mahasiswa
      prisma.penilaian.delete({ where: { mahasiswaId } }),

      // Kembalikan status mahasiswa menjadi Aktif jika sebelumnya Tuntas
      prisma.mahasiswa.updateMany({ where: { id: mahasiswaId, status: "Tuntas" }, data: { status: "Aktif" } }),
    ]);

    return { success: true, message: "Nilai mahasiswa berhasil dibatalkan!" };
  } catch (error) {
    console.log("❌ Batal Penilaian Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

const MAX_PENILAIAN_IMPORT_ROWS = 500;

const PENILAIAN_IMPORT_COLUMN_ALIASES = {
  nim: ["nim"],
  nilai: ["nilai"],
} as const satisfies Record<PenilaianImportColumn, readonly string[]>;

const PENILAIAN_IMPORT_COLUMN_LABELS: Record<PenilaianImportColumn, string> = {
  nim: "NIM",
  nilai: "Nilai",
};

export async function importPenilaian(data: ImportPenilaianInput): Promise<ActionResponse<ImportPenilaianResult>> {
  const parsed = ImportPenilaianSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "File tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { file } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    let rows: ExcelSheetRows;

    try {
      rows = await readExcelSheet(file);
    } catch (error) {
      if (error instanceof ExcelReadError) {
        console.error("❌ Import Penilaian Error :", error);
        return { success: false, message: error.message };
      }

      throw error;
    }

    const [headerRow = [], ...dataRows] = rows;

    const columns = resolveExcelColumnIndexes(headerRow, PENILAIAN_IMPORT_COLUMN_ALIASES);

    if (!columns.exist) {
      const missingHeaderColumns = columns.missingColumns.map((column) => PENILAIAN_IMPORT_COLUMN_LABELS[column]).join(", ");
      return { success: false, message: `Kolom tidak ditemukan : ${missingHeaderColumns}. Silahkan gunakan template yang disediakan.` };
    }

    const filledDataRows = getFilledExcelRows(dataRows, { startRowNumber: 2 }).filter(
      ({ cells }) => normalizeExcelCellValue(cells[columns.columnIndexes.nilai]) !== "",
    );

    if (filledDataRows.length === 0) {
      return { success: false, message: "File Excel tidak berisi data penilaian mahasiswa!" };
    }

    if (filledDataRows.length > MAX_PENILAIAN_IMPORT_ROWS) {
      return {
        success: false,
        message: `Maksimal ${MAX_PENILAIAN_IMPORT_ROWS} baris per import. File Anda berisi ${filledDataRows.length} baris.`,
      };
    }

    const { rowsToApply, rowErrors } = await preparePenilaianImportRows(filledDataRows, columns.columnIndexes);

    if (rowErrors.length > 0) {
      rowErrors.sort((a, b) => a.row - b.row);

      return {
        success: false,
        message: `Terdapat ${rowErrors.length} kesalahan data! Tidak ada data yang diimport.`,
        data: { errors: rowErrors },
      };
    }

    await applyPenilaianImport(rowsToApply);

    return { success: true, message: `${rowsToApply.length} mahasiswa berhasil dinilai!` };
  } catch (error) {
    console.log("❌ Import Penilaian Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}
