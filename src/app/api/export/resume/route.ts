import { z } from "zod";
import { format } from "date-fns";
import { getSession } from "@/libs/session";
import { NextRequest } from "next/server";
import { StatusResume } from "@/generated/prisma/enums";
import { getAllResume } from "@/features/resume/queries";
import { buildExcelResponse } from "@/libs/excel";

export const runtime = "nodejs";

const StatusFilterSchema = z.array(z.enum(StatusResume));

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return Response.json({ message: "Anda belum terautentikasi! Silahkan login terlebih dahulu." }, { status: 401 });
    }

    if (!user.isAccountReset) {
      return Response.json({ message: "Akun anda belum diaktivasi/direset!" }, { status: 403 });
    }

    if (user.currentRole !== "Kaprodi") {
      return Response.json({ message: "Hanya Kaprodi yang dapat mengunduh data resume!" }, { status: 403 });
    }

    const parsed = StatusFilterSchema.safeParse(request.nextUrl.searchParams.getAll("status"));

    if (!parsed.success) {
      return Response.json({ message: "Filter status tidak valid!" }, { status: 400 });
    }

    const status = parsed.data.length ? parsed.data : undefined;
    const resumeList = await getAllResume(status);

    return await buildExcelResponse({
      fileName: `daftar-resume-${format(new Date(), "yyyy-MM-dd")}.xlsx`,
      sheetName: "Daftar Resume",
      columns: [
        { header: "Nama", width: 28, value: (row) => row.namaMahasiswa },
        { header: "NIM", width: 16, value: (row) => row.nim },
        { header: "Mitra", width: 32, wrap: true, value: (row) => row.mitra },
        { header: "Subjudul", width: 42, wrap: true, value: (row) => row.subjudul },
        { header: "Tanggal Pengajuan", width: 20, value: (row) => row.tanggalPengajuan },
        { header: "Dosen Pembimbing", width: 28, value: (row) => row.dosenPembimbing ?? "Tidak Ditemukan" },
        { header: "Status", width: 16, value: (row) => row.status },
      ],
      rows: resumeList,
    });
  } catch (error) {
    console.error("❌ Export Daftar Resume Error :", error);
    return Response.json({ message: "Terjadi kesalahan pada server!" }, { status: 500 });
  }
}
