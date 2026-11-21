import { format } from "date-fns";
import { getSession } from "@/libs/session";
import { buildExcelResponse } from "@/libs/excel";
import { getAllMahasiswaCapstoneProjectProgress } from "@/features/monitoring/queries";

export const runtime = "nodejs";

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
      return Response.json({ message: "Hanya Kaprodi yang dapat mengunduh data monitoring!" }, { status: 403 });
    }

    const data = await getAllMahasiswaCapstoneProjectProgress();

    return await buildExcelResponse({
      fileName: `monitoring-capstone-project-${format(new Date(), "yyyy-MM-dd")}.xlsx`,
      sheetName: "Monitoring Capstone Project",
      columns: [
        { header: "Nama", width: 28, value: (row) => row.namaLengkap },
        { header: "NIM", width: 16, value: (row) => row.nim },
        { header: "Kelas", width: 12, value: (row) => row.kelas.nama },
        { header: "Angkatan", width: 10, value: (row) => row.kelas.angkatan },
        { header: "Status Tim", width: 16, value: (row) => (row.tim ? "Terdaftar" : "Tidak Terdaftar") },
        { header: "Status Proposal", width: 18, value: (row) => row.proposal?.status ?? "Belum Upload" },
        { header: "Status Resume", width: 18, value: (row) => row.resume?.status ?? "Belum Upload" },
        { header: "Dosen Pembimbing", width: 28, value: (row) => row.dosenPembimbing ?? "Belum Ditentukan" },
      ],
      rows: data,
    });
  } catch (error) {
    console.error("❌ Export Monitoring Capstone Project Error :", error);
    return Response.json({ message: "Terjadi kesalahan pada server!" }, { status: 500 });
  }
}
