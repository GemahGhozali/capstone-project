import { z } from "zod";
import { format } from "date-fns";
import { getSession } from "@/libs/session";
import { NextRequest } from "next/server";
import { StatusProposal } from "@/generated/prisma/enums";
import { getAllProposal } from "@/features/proposal/queries";
import { buildExcelResponse } from "@/libs/excel";

export const runtime = "nodejs";

const StatusFilterSchema = z.array(z.enum(StatusProposal));

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
      return Response.json({ message: "Hanya Kaprodi yang dapat mengunduh data proposal!" }, { status: 403 });
    }

    const parsed = StatusFilterSchema.safeParse(request.nextUrl.searchParams.getAll("status"));

    if (!parsed.success) {
      return Response.json({ message: "Filter status tidak valid!" }, { status: 400 });
    }

    const status = parsed.data.length ? parsed.data : undefined;
    const proposalList = await getAllProposal(status);

    return await buildExcelResponse({
      fileName: `daftar-proposal-${format(new Date(), "yyyy-MM-dd")}.xlsx`,
      sheetName: "Daftar Proposal",
      columns: [
        { header: "Nama Tim", width: 26, value: (row) => row.namaTim },
        { header: "Mitra", width: 32, wrap: true, value: (row) => row.mitra },
        { header: "Judul", width: 48, wrap: true, value: (row) => row.judul },
        { header: "Tanggal Pengajuan", width: 20, value: (row) => row.tanggalPengajuan },
        { header: "Status", width: 14, value: (row) => row.status },
      ],
      rows: proposalList,
    });
  } catch (error) {
    console.error("❌ Export Daftar Proposal Error :", error);
    return Response.json({ message: "Terjadi kesalahan pada server!" }, { status: 500 });
  }
}
