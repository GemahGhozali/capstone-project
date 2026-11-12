import "server-only";

import { prisma } from "@/libs/prisma";
import { requireRole } from "@/libs/dal";
import { formatDateToISODateString, formatTimeToHHmm, getStartOfTodayUTC } from "./utils";

export async function getJadwalBimbinganDosen(dosenId: string) {
  await requireRole("Mahasiswa", "Dosen Pembimbing");

  const jadwalList = await prisma.jadwalKonsultasi.findMany({
    where: { dosenId, tanggal: { gte: getStartOfTodayUTC() } },
    select: {
      id: true,
      tanggal: true,
      jamMulai: true,
      jamTutup: true,
      kuota: true,
      _count: {
        select: {
          bookings: {
            where: { status: "Dipesan" },
          },
        },
      },
    },
    orderBy: [{ tanggal: "asc" }, { jamMulai: "asc" }],
  });

  return jadwalList.map((jadwal) => ({
    id: jadwal.id,
    tanggal: formatDateToISODateString(jadwal.tanggal),
    jamMulai: formatTimeToHHmm(jadwal.jamMulai),
    jamTutup: formatTimeToHHmm(jadwal.jamTutup),
    kuota: jadwal.kuota,
    totalBooking: jadwal._count.bookings,
  }));
}
