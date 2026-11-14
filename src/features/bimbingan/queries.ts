import "server-only";

import { prisma } from "@/libs/prisma";
import { requireRole } from "@/libs/dal";
import { checkIsJadwalBimbinganHasPassed } from "./services";
import { formatDateToISODateString, formatTimeToHHmm, getStartOfTodayUTC } from "./utils";

export async function getJadwalBimbinganDosen() {
  const { userId: dosenId } = await requireRole("Dosen Pembimbing");

  try {
    const jadwalList = await prisma.jadwalBimbingan.findMany({
      where: { dosenId },
      select: {
        id: true,
        tanggal: true,
        jamMulai: true,
        jamTutup: true,
        status: true,
        kuota: true,
        _count: {
          select: {
            bookings: {
              where: { status: "Dipesan" },
            },
          },
        },
      },
      orderBy: [{ tanggal: "desc" }, { jamMulai: "asc" }],
    });

    return jadwalList.map((jadwal) => ({
      id: jadwal.id,
      status: jadwal.status,
      tanggal: formatDateToISODateString(jadwal.tanggal),
      jamMulai: formatTimeToHHmm(jadwal.jamMulai),
      jamTutup: formatTimeToHHmm(jadwal.jamTutup),
      kuota: jadwal.kuota,
      totalBooking: jadwal._count.bookings,
      timeHasPassed: checkIsJadwalBimbinganHasPassed({ date: jadwal.tanggal, startTime: jadwal.jamMulai }),
    }));
  } catch (error) {
    console.log("❌ Get Jadwal Bimbingan Dosen Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getJadwalBimbinganMahasiswa() {
  const { userId: mahasiswaId } = await requireRole("Mahasiswa");

  try {
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      select: { dosenId: true },
    });

    if (!mahasiswa?.dosenId) return [];

    const jadwalList = await prisma.jadwalBimbingan.findMany({
      where: { dosenId: mahasiswa.dosenId, tanggal: { gte: getStartOfTodayUTC() } },
      select: {
        id: true,
        tanggal: true,
        jamMulai: true,
        status: true,
        jamTutup: true,
        kuota: true,
        _count: {
          select: {
            bookings: {
              where: { status: "Dipesan" },
            },
          },
        },
        bookings: {
          where: { mahasiswaId, status: "Dipesan" },
          select: { id: true },
          take: 1,
        },
      },
      orderBy: [{ tanggal: "asc" }, { jamMulai: "asc" }],
    });

    return jadwalList.map((jadwal) => ({
      id: jadwal.id,
      status: jadwal.status,
      tanggal: formatDateToISODateString(jadwal.tanggal),
      jamMulai: formatTimeToHHmm(jadwal.jamMulai),
      jamTutup: formatTimeToHHmm(jadwal.jamTutup),
      kuota: jadwal.kuota,
      totalBooking: jadwal._count.bookings,
      timeHasPassed: checkIsJadwalBimbinganHasPassed({ date: jadwal.tanggal, startTime: jadwal.jamMulai }),
      isBooked: jadwal.bookings.length > 0,
    }));
  } catch (error) {
    console.log("❌ Get Jadwal Bimbingan Mahasiswa Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getBookingBimbinganDosen() {
  const { userId: dosenId } = await requireRole("Dosen Pembimbing");

  try {
    const bookingList = await prisma.bookingBimbingan.findMany({
      where: { jadwal: { dosenId } },
      select: {
        id: true,
        catatanMahasiswa: true,
        catatanDosen: true,
        status: true,
        tanggalPembatalan: true,
        alasanPembatalan: true,
        dibatalkanOleh: true,
        jadwal: {
          select: {
            id: true,
            tanggal: true,
            jamMulai: true,
            jamTutup: true,
            status: true,
          },
        },
        mahasiswa: {
          select: {
            nim: true,
            user: { select: { namaLengkap: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return bookingList.map((booking) => ({
      id: booking.id,
      catatanMahasiswa: booking.catatanMahasiswa,
      catatanDosen: booking.catatanDosen,
      status: booking.status,
      tanggalPembatalan: booking.tanggalPembatalan,
      alasanPembatalan: booking.alasanPembatalan,
      dibatalkanOleh: booking.dibatalkanOleh,
      jadwal: {
        id: booking.jadwal.id,
        tanggal: formatDateToISODateString(booking.jadwal.tanggal),
        jamMulai: formatTimeToHHmm(booking.jadwal.jamMulai),
        jamTutup: formatTimeToHHmm(booking.jadwal.jamTutup),
        status: booking.jadwal.status,
      },
      mahasiswa: {
        nim: booking.mahasiswa.nim,
        namaLengkap: booking.mahasiswa.user.namaLengkap,
      },
    }));
  } catch (error) {
    console.log("❌ Get Booking Bimbingan Dosen Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getBookingBimbinganMahasiswa() {
  const { userId: mahasiswaId } = await requireRole("Mahasiswa");

  try {
    const bookingList = await prisma.bookingBimbingan.findMany({
      where: { mahasiswaId },
      select: {
        id: true,
        catatanMahasiswa: true,
        catatanDosen: true,
        status: true,
        tanggalPembatalan: true,
        alasanPembatalan: true,
        dibatalkanOleh: true,
        jadwal: {
          select: {
            id: true,
            tanggal: true,
            jamMulai: true,
            jamTutup: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return bookingList.map((booking) => ({
      id: booking.id,
      catatanMahasiswa: booking.catatanMahasiswa,
      catatanDosen: booking.catatanDosen,
      status: booking.status,
      tanggalPembatalan: booking.tanggalPembatalan,
      alasanPembatalan: booking.alasanPembatalan,
      dibatalkanOleh: booking.dibatalkanOleh,
      jadwal: {
        id: booking.jadwal.id,
        tanggal: formatDateToISODateString(booking.jadwal.tanggal),
        jamMulai: formatTimeToHHmm(booking.jadwal.jamMulai),
        jamTutup: formatTimeToHHmm(booking.jadwal.jamTutup),
        status: booking.jadwal.status,
      },
    }));
  } catch (error) {
    console.log("❌ Get Booking Bimbingan Mahasiswa Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}
