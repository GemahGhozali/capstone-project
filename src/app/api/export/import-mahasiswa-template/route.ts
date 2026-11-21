import { getSession } from "@/libs/session";
import { getAllKelas } from "@/features/kelas/queries";
import { buildExcelSheetData, buildExcelWorkbookResponse, type ExcelColumn } from "@/libs/excel";

export const runtime = "nodejs";

type TemplateRow = {
  nim: string;
  namaLengkap: string;
  kodeKelas: string;
  tanggalMasuk: Date;
};

type KelasRow = {
  kode: string;
  nama: string;
  angkatan: number;
};

const templateColumns: ExcelColumn<TemplateRow>[] = [
  { header: "NIM", width: 18, value: (row) => row.nim },
  { header: "Nama Lengkap", width: 30, value: (row) => row.namaLengkap },
  { header: "Kode Kelas", width: 14, value: (row) => row.kodeKelas },
  { header: "Tanggal Masuk", width: 16, value: (row) => row.tanggalMasuk },
];

const kelasColumns: ExcelColumn<KelasRow>[] = [
  { header: "Kode Kelas", width: 14, value: (row) => row.kode },
  { header: "Nama Kelas", width: 24, value: (row) => row.nama },
  { header: "Angkatan", width: 10, value: (row) => row.angkatan },
];

export async function GET() {
  try {
    const user = await getSession();

    if (!user) {
      return Response.json({ message: "Anda belum terautentikasi! Silahkan login terlebih dahulu." }, { status: 401 });
    }

    if (!user.isAccountReset) {
      return Response.json({ message: "Akun anda belum diaktivasi/direset!" }, { status: 403 });
    }

    if (user.currentRole !== "Kaprodi") {
      return Response.json({ message: "Hanya Kaprodi yang dapat mengunduh template import mahasiswa!" }, { status: 403 });
    }

    const kelasList = await getAllKelas();
    const sortedKelas = [...kelasList].sort((a, b) => a.kode.localeCompare(b.kode));

    const templateSheet = buildExcelSheetData({
      columns: templateColumns,
      rows: [
        {
          nim: "1234567890",
          namaLengkap: "Contoh Nama Mahasiswa",
          kodeKelas: "TI-1A",
          tanggalMasuk: new Date(),
        },
      ],
    });

    const kelasSheet = buildExcelSheetData({ columns: kelasColumns, rows: sortedKelas });

    return await buildExcelWorkbookResponse({
      fileName: "template-import-mahasiswa.xlsx",
      sheets: [
        { sheetName: "Import Mahasiswa", ...templateSheet },
        { sheetName: "Daftar Kelas", ...kelasSheet },
      ],
    });
  } catch (error) {
    console.error("❌ Export Template Import Mahasiswa Error :", error);
    return Response.json({ message: "Terjadi kesalahan pada server!" }, { status: 500 });
  }
}
