"use server";

import { prisma } from "@/libs/prisma";
import { formatZodError } from "@/utils/format-zod-error";
import { ActionResponse } from "@/types";
import { checkIsJadwalBimbinganHasPassed } from "./services";
import { userIsValidAndHasRole, requireRole } from "@/libs/dal";
import { parseDateToUTC, parseTimeToUTC, formatTimeToHHmm } from "./utils";
import { CreateJadwalBimbinganInput, BookingJadwalInput, CancelBookingInput, CompleteBookingInput } from "./schemas";
import { CreateJadwalBimbinganSchema, BookingJadwalSchema, CancelBookingSchema, CompleteBookingSchema } from "./schemas";

export async function createJadwalBimbingan(data: CreateJadwalBimbinganInput): Promise<ActionResponse> {
  const parsed = CreateJadwalBimbinganSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { tanggal, jamMulai, jamTutup, kuota } = parsed.data;

  try {
    const { id: dosenId } = await userIsValidAndHasRole("Dosen Pembimbing");

    const dosen = await prisma.dosen.findUnique({
      where: { id: dosenId },
      select: {
        id: true,
        status: true,
        user: { select: { isActive: true } },
        dosenPembimbingDetail: { select: { status: true } },
      },
    });

    // Validasi 1 : Cek apakah data dosen ditemukan
    if (!dosen) {
      return { success: false, message: "Anda tidak terdaftar sebagai dosen!" };
    }

    // Validasi 2 : Cek apakah dosen sedang aktif
    const dosenNotActive = !dosen.user.isActive || dosen.status !== "Aktif";

    if (dosenNotActive) {
      return { success: false, message: "Anda tidak terdaftar sebagai dosen yang berstatus aktif!" };
    }

    // Validasi 3 : Cek apakah dosen memiliki dosen pembimbing detail
    if (!dosen.dosenPembimbingDetail) {
      return { success: false, message: "Anda tidak memiliki profil dosen pembimbing!" };
    }

    // Validasi 4 : Cek apakah status dosen pembimbing detail bukan Tutup
    const statusBimbinganIsClosed = dosen.dosenPembimbingDetail.status === "Tutup";

    if (statusBimbinganIsClosed) {
      return { success: false, message: "Status bimbingan anda sedang ditutup! Hubungi Kaprodi untuk membukanya." };
    }

    // Validasi 5 : Cek apakah jadwal baru tidak overlap dengan jadwal lain di tanggal yang sama
    const existingJadwal = await prisma.jadwalBimbingan.findMany({
      where: { dosenId, tanggal: parseDateToUTC(tanggal) },
      select: { jamMulai: true, jamTutup: true },
    });

    const jadwalConflicted = existingJadwal.some((jadwal) => {
      const jadwalStartTime = formatTimeToHHmm(jadwal.jamMulai);
      const jadwalEndTime = formatTimeToHHmm(jadwal.jamTutup);
      return jadwalStartTime < jamTutup && jadwalEndTime > jamMulai;
    });

    if (jadwalConflicted) {
      return { success: false, message: "Jadwal bentrok dengan jadwal bimbingan lain di tanggal tersebut!" };
    }

    await prisma.jadwalBimbingan.create({
      data: {
        kuota,
        dosenId,
        tanggal: parseDateToUTC(tanggal),
        jamMulai: parseTimeToUTC(jamMulai),
        jamTutup: parseTimeToUTC(jamTutup),
      },
    });

    return { success: true, message: "Jadwal bimbingan berhasil dibuat!" };
  } catch (error) {
    console.log("❌ Create Jadwal Konsultasi Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function deleteJadwalBimbingan(jadwalId: string): Promise<ActionResponse> {
  try {
    const { id: dosenId } = await userIsValidAndHasRole("Dosen Pembimbing");

    const jadwal = await prisma.jadwalBimbingan.findUnique({
      where: { id: jadwalId },
      select: {
        id: true,
        dosenId: true,
        _count: {
          select: {
            bookings: {
              where: {
                status: { not: "Dibatalkan" },
              },
            },
          },
        },
      },
    });

    // Validasi 1 : Cek apakah jadwal bimbingan ditemukan
    if (!jadwal) {
      return { success: false, message: "Jadwal bimbingan tidak ditemukan!" };
    }

    // Validasi 2 : Cek apakah jadwal milik dosen sendiri
    const jadwalNotOwnedByDosen = jadwal.dosenId !== dosenId;

    if (jadwalNotOwnedByDosen) {
      return { success: false, message: "Anda hanya bisa menghapus jadwal milik anda!" };
    }

    // Validasi 3 : Cek apakah jadwal masih memiliki booking yang aktif (Dipesan/Selesai)
    const jadwalHasActiveBooking = jadwal._count.bookings > 0;

    if (jadwalHasActiveBooking) {
      return { success: false, message: "Jadwal masih memiliki booking aktif! Silahkan tutup jadwal terlebih dahulu." };
    }

    await prisma.jadwalBimbingan.delete({ where: { id: jadwalId } });

    return { success: true, message: "Jadwal bimbingan berhasil dihapus!" };
  } catch (error) {
    console.log("❌ Delete Jadwal Bimbingan Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function bookingBimbingan(jadwalId: string, data: BookingJadwalInput): Promise<ActionResponse> {
  const parsed = BookingJadwalSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { catatanMahasiswa } = parsed.data;

  try {
    const { id: mahasiswaId } = await userIsValidAndHasRole("Mahasiswa");

    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId },
      select: {
        id: true,
        dosenId: true,
        resume: { select: { status: true } },
      },
    });

    // Validasi 1 : Cek apakah data mahasiswa ditemukan
    if (!mahasiswa) {
      return { success: false, message: "Anda tidak terdaftar sebagai mahasiswa!" };
    }

    // Validasi 2 : Cek apakah resume mahasiswa sudah disetujui
    const mahasiswaResumeIsNotApproved = mahasiswa.resume?.status !== "Disetujui";

    if (mahasiswaResumeIsNotApproved) {
      return { success: false, message: "Resume anda belum disetujui! Anda belum bisa booking bimbingan." };
    }

    // Validasi 3 : Cek apakah mahasiswa sudah memiliki dosen pembimbing tetap
    if (!mahasiswa.dosenId) {
      return { success: false, message: "Anda belum memiliki dosen pembimbing!" };
    }

    const jadwal = await prisma.jadwalBimbingan.findUnique({
      where: { id: jadwalId },
      select: {
        id: true,
        dosenId: true,
        kuota: true,
        status: true,
        tanggal: true,
        jamMulai: true,
        _count: {
          select: {
            bookings: {
              where: {
                status: { not: "Dibatalkan" },
              },
            },
          },
        },
      },
    });

    // Validasi 4 : Cek apakah jadwal bimbingan ditemukan
    if (!jadwal) {
      return { success: false, message: "Jadwal bimbingan tidak ditemukan!" };
    }

    // Validasi 5 : Cek apakah waktu jadwal bimbingan sudah lewat
    const jadwalHasPassed = checkIsJadwalBimbinganHasPassed({ date: jadwal.tanggal, startTime: jadwal.jamMulai });

    if (jadwalHasPassed) {
      return { success: false, message: "Waktu jadwal bimbingan sudah lewat! Pilih jadwal yang masih tersedia." };
    }

    // Validasi 6 : Cek apakah jadwal masih aktif (bisa dibooking)
    const jadwalIsClosed = jadwal.status !== "Aktif";

    if (jadwalIsClosed) {
      return { success: false, message: "Jadwal bimbingan sudah ditutup! Pilih jadwal yang masih tersedia." };
    }

    // Validasi 7 : Cek apakah jadwal memang milik dosen pembimbing mahasiswa
    const mahasiswaBookingUnassignedDosen = jadwal.dosenId !== mahasiswa.dosenId;

    if (mahasiswaBookingUnassignedDosen) {
      return { success: false, message: "Anda hanya bisa booking jadwal milik dosen pembimbing Anda!" };
    }

    // Validasi 8 : Cek apakah mahasiswa belum punya booking yang belum dibatalkan (Dipesan/Selesai) di jadwal yang sama
    const mahasiswaDidDoubleBooking = await prisma.bookingBimbingan.findFirst({
      where: { jadwalId, mahasiswaId, status: { in: ["Dipesan", "Selesai"] } },
      select: { id: true, status: true },
    });

    if (mahasiswaDidDoubleBooking) {
      return { success: false, message: "Anda sudah membooking jadwal ini!" };
    }

    // Validasi 9 : Cek sisa kuota jadwal
    const quotaIsFull = jadwal._count.bookings >= jadwal.kuota;

    if (quotaIsFull) {
      return { success: false, message: "Kuota jadwal ini sudah penuh!" };
    }

    await prisma.bookingBimbingan.create({ data: { jadwalId, mahasiswaId, catatanMahasiswa, status: "Dipesan" } });

    return { success: true, message: "Jadwal bimbingan berhasil dipesan!" };
  } catch (error) {
    console.log("❌ Booking Jadwal Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function cancelBookingBimbingan(bookingId: string, data: CancelBookingInput): Promise<ActionResponse> {
  const session = await requireRole("Mahasiswa", "Dosen Pembimbing");

  const parsed = CancelBookingSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { alasanPembatalan } = parsed.data;

  try {
    const booking = await prisma.bookingBimbingan.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        status: true,
        mahasiswaId: true,
        jadwal: { select: { dosenId: true } },
      },
    });

    // Validasi 1 : Cek apakah data booking ditemukan
    if (!booking) {
      return { success: false, message: "Booking tidak ditemukan!" };
    }

    // Validasi 2 : Cek apakah status booking masih bisa dibatalkan
    if (booking.status === "Selesai") {
      return { success: false, message: "Jadwal bimbingan yang sudah selesai tidak bisa dibatalkan!" };
    }

    if (booking.status === "Dibatalkan") {
      return { success: false, message: "Jadwal bimbingan ini sudah dibatalkan!" };
    }

    // Validasi 3 : Cek hak akses pembatalan (mahasiswa = booking miliknya, dosen = booking di jadwal miliknya)
    const isMahasiswaCancel = session.currentRole === "Mahasiswa";
    const isDosenCancel = session.currentRole === "Dosen Pembimbing";

    const mahasiswaTriesToCancelUnownedJadwal = isDosenCancel && booking.jadwal.dosenId !== session.userId;

    if (mahasiswaTriesToCancelUnownedJadwal) {
      return { success: false, message: "Anda tidak berhak membatalkan jadwal booking ini!" };
    }

    const dosenTriesToCancelUnownedJadwal = isDosenCancel && booking.jadwal.dosenId !== session.userId;

    if (dosenTriesToCancelUnownedJadwal) {
      return { success: false, message: "Anda tidak berhak membatalkan jadwal booking ini!" };
    }

    await prisma.bookingBimbingan.update({
      where: { id: booking.id },
      data: {
        status: "Dibatalkan",
        alasanPembatalan,
        dibatalkanOleh: isMahasiswaCancel ? "Mahasiswa" : "Dosen",
        tanggalPembatalan: new Date(),
      },
    });

    return { success: true, message: "Booking berhasil dibatalkan!" };
  } catch (error) {
    console.log("❌ Cancel Booking Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function completeBookingBimbingan(bookingId: string, data: CompleteBookingInput): Promise<ActionResponse> {
  const session = await requireRole("Dosen Pembimbing");

  const parsed = CompleteBookingSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { catatanDosen } = parsed.data;

  try {
    const booking = await prisma.bookingBimbingan.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        status: true,
        jadwal: { select: { dosenId: true } },
      },
    });

    // Validasi 1 : Cek apakah data booking ditemukan
    if (!booking) {
      return { success: false, message: "Booking tidak ditemukan!" };
    }

    // Validasi 2 : Cek apakah status booking masih bisa ditandai selesai
    if (booking.status === "Selesai") {
      return { success: false, message: "Booking ini sudah ditandai selesai!" };
    }

    if (booking.status === "Dibatalkan") {
      return { success: false, message: "Booking ini sudah dibatalkan!" };
    }

    // Validasi 3 : Cek apakah booking berada di jadwal milik dosen sendiri
    const bookingNotOwnedByDosen = booking.jadwal.dosenId !== session.userId;

    if (bookingNotOwnedByDosen) {
      return { success: false, message: "Anda hanya bisa menandai booking di jadwal milik anda!" };
    }

    await prisma.bookingBimbingan.update({ where: { id: booking.id }, data: { status: "Selesai", catatanDosen } });

    return { success: true, message: "Booking bimbingan berhasil ditandai selesai!" };
  } catch (error) {
    console.log("❌ Complete Booking Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function closeJadwalBimbingan(jadwalId: string, data: CancelBookingInput): Promise<ActionResponse> {
  const session = await requireRole("Dosen Pembimbing");

  const parsed = CancelBookingSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { alasanPembatalan } = parsed.data;

  try {
    const jadwal = await prisma.jadwalBimbingan.findUnique({
      where: { id: jadwalId },
      select: {
        id: true,
        dosenId: true,
        status: true,
      },
    });

    // Validasi 1 : Cek apakah jadwal bimbingan ditemukan
    if (!jadwal) {
      return { success: false, message: "Jadwal bimbingan tidak ditemukan!" };
    }

    // Validasi 2 : Cek apakah jadwal milik dosen sendiri
    const jadwalNotOwnedByDosen = jadwal.dosenId !== session.userId;

    if (jadwalNotOwnedByDosen) {
      return { success: false, message: "Anda hanya bisa menutup jadwal bimbingan milik anda!" };
    }

    // Validasi 3 : Cek apakah jadwal belum ditutup
    const jadwalIsClosed = jadwal.status === "Ditutup";

    if (jadwalIsClosed) {
      return { success: false, message: "Jadwal bimbingan ini sudah ditutup!" };
    }

    const totalBooking = await prisma.$transaction(async (transaction) => {
      await transaction.jadwalBimbingan.update({ where: { id: jadwalId }, data: { status: "Ditutup" } });

      const activeBookingCount = await transaction.bookingBimbingan.count({ where: { jadwalId, status: "Dipesan" } });

      if (activeBookingCount > 0) {
        await transaction.bookingBimbingan.updateMany({
          where: { jadwalId, status: "Dipesan" },
          data: {
            status: "Dibatalkan",
            alasanPembatalan,
            dibatalkanOleh: "Dosen",
            tanggalPembatalan: new Date(),
          },
        });
      }

      return activeBookingCount;
    });

    return {
      success: true,
      message:
        totalBooking > 0 ? `Jadwal bimbingan berhasil ditutup! ${totalBooking} booking ikut dibatalkan.` : "Jadwal bimbingan berhasil ditutup!",
    };
  } catch (error) {
    console.log("❌ Tutup Jadwal Bimbingan Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function openJadwalBimbingan(jadwalId: string): Promise<ActionResponse> {
  const session = await requireRole("Dosen Pembimbing");

  try {
    const jadwal = await prisma.jadwalBimbingan.findUnique({
      where: { id: jadwalId },
      select: {
        id: true,
        dosenId: true,
        status: true,
        jamMulai: true,
        tanggal: true,
      },
    });

    // Validasi 1 : Cek apakah jadwal bimbingan ditemukan
    if (!jadwal) {
      return { success: false, message: "Jadwal bimbingan tidak ditemukan!" };
    }

    // Validasi 2 : Cek apakah jadwal milik dosen sendiri
    const jadwalNotOwnedByDosen = jadwal.dosenId !== session.userId;

    if (jadwalNotOwnedByDosen) {
      return { success: false, message: "Anda hanya bisa menutup jadwal bimbingan milik anda!" };
    }

    // Validasi 3 : Cek apakah jadwal masih aktif
    const jadwalStillActive = jadwal.status === "Aktif";

    if (jadwalStillActive) {
      return { success: false, message: "Jadwal bimbingan ini masih aktif!" };
    }

    // Validasi 4 : Cek apakah jadwal sudah lampau
    const jadwalHasPassed = checkIsJadwalBimbinganHasPassed({ date: jadwal.tanggal, startTime: jadwal.jamMulai });

    if (jadwalHasPassed) {
      return { success: false, message: "Waktu jadwal bimbingan sudah lewat dan tidak bisa dibuka kembali!" };
    }

    await prisma.jadwalBimbingan.update({ where: { id: jadwalId }, data: { status: "Aktif" } });

    return { success: true, message: "Jadwal bimbingan berhasil dibuka kembali!" };
  } catch (error) {
    console.log("❌ Tutup Jadwal Bimbingan Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}
