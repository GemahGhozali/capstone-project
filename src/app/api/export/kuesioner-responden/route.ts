import { z } from "zod";
import { format } from "date-fns";
import { getSession } from "@/libs/session";
import { NextRequest } from "next/server";
import { KuesionerRespondentExportRow } from "@/features/kuesioner/types";
import { getKuesionerRespondentExportData } from "@/features/kuesioner/queries";
import { buildExcelResponse, ExcelColumn } from "@/libs/excel";

export const runtime = "nodejs";

const QuerySchema = z.object({
  kuesionerId: z.uuid("Kuesioner tidak valid!"),
});

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
      return Response.json({ message: "Hanya Kaprodi yang dapat mengunduh data responden kuesioner!" }, { status: 403 });
    }

    const parsed = QuerySchema.safeParse({
      kuesionerId: request.nextUrl.searchParams.get("kuesionerId"),
    });

    if (!parsed.success) {
      return Response.json({ message: "Kuesioner tidak valid!" }, { status: 400 });
    }

    const kuesioner = await getKuesionerRespondentExportData(parsed.data.kuesionerId);

    if (!kuesioner) {
      return Response.json({ message: "Kuesioner tidak ditemukan!" }, { status: 404 });
    }

    const columns: ExcelColumn<KuesionerRespondentExportRow>[] = kuesioner.columns.map((column) => ({
      header: column.header,
      width: column.id === "namaResponden" ? 18 : column.id === "tanggalSubmit" ? 20 : 40,
      wrap: column.id !== "namaResponden" && column.id !== "tanggalSubmit",
      value: (row) => row[column.id] ?? null,
    }));

    return await buildExcelResponse({
      fileName: `daftar-responden-kuesioner-${format(new Date(), "yyyy-MM-dd")}.xlsx`,
      sheetName: "Responden Kuesioner",
      columns,
      rows: kuesioner.rows,
    });
  } catch (error) {
    console.error("❌ Export Responden Kuesioner Error :", error);
    return Response.json({ message: "Terjadi kesalahan pada server!" }, { status: 500 });
  }
}
