import { getSession } from "@/libs/session";
import { getAllPenilaianMahasiswa } from "@/features/penilaian/queries";
import { buildExcelSheetData, buildExcelWorkbookResponse, type ExcelColumn } from "@/libs/excel";

export const runtime = "nodejs";

type MahasiswaRow = {
  nim: string;
  namaLengkap: string;
  kelas: string;
  angkatan: number;
  status: string;
  nilai: number | null;
};

const mahasiswaColumns: ExcelColumn<MahasiswaRow>[] = [
  { header: "NIM", width: 18, value: (row) => row.nim },
  { header: "Nama Lengkap", width: 30, value: (row) => row.namaLengkap },
  { header: "Kelas", width: 14, value: (row) => row.kelas },
  { header: "Angkatan", width: 10, value: (row) => row.angkatan },
  { header: "Status", width: 12, value: (row) => row.status },
  { header: "Nilai", width: 10, value: (row) => row.nilai },
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
      return Response.json({ message: "Hanya Kaprodi yang dapat mengunduh template import penilaian!" }, { status: 403 });
    }

    const penilaianList = await getAllPenilaianMahasiswa();

    const mahasiswaRows: MahasiswaRow[] = penilaianList.map((mahasiswa) => ({
      nim: mahasiswa.nim,
      namaLengkap: mahasiswa.namaLengkap,
      kelas: mahasiswa.kelas.nama,
      angkatan: mahasiswa.kelas.angkatan,
      status: mahasiswa.status,
      nilai: mahasiswa.nilai,
    }));

    const mahasiswaSheet = buildExcelSheetData({ columns: mahasiswaColumns, rows: mahasiswaRows });

    return await buildExcelWorkbookResponse({
      fileName: "template-import-penilaian.xlsx",
      sheets: [{ sheetName: "Daftar Mahasiswa", ...mahasiswaSheet }],
    });
  } catch (error) {
    console.error("❌ Export Template Import Penilaian Error :", error);
    return Response.json({ message: "Terjadi kesalahan pada server!" }, { status: 500 });
  }
}
