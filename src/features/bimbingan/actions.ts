"use server";

import { prisma } from "@/libs/prisma";
import { formatZodError } from "@/utils/format-zod-error";
import { ActionResponse } from "@/types";
import { userIsValidAndHasRole, requireRole } from "@/libs/dal";
import { CreateJadwalBimbinganInput, BookingJadwalInput, CancelBookingInput } from "./schemas";
import { CreateJadwalBimbinganSchema, BookingJadwalSchema, CancelBookingSchema } from "./schemas";

const JAM_BASE_DATE = "2000-01-01";

function parseTanggal(tanggal: string): Date {
  return new Date(`${tanggal}T00:00:00.000Z`);
}

function parseJam(jam: string): Date {
  return new Date(`${JAM_BASE_DATE}T${jam}:00.000Z`);
}

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

    await prisma.jadwalKonsultasi.create({
      data: {
        kuota,
        dosenId,
        tanggal: parseTanggal(tanggal),
        jamMulai: parseJam(jamMulai),
        jamTutup: parseJam(jamTutup),
      },
    });

    return { success: true, message: "Jadwal bimbingan berhasil dibuat!" };
  } catch (error) {
    console.log("❌ Create Jadwal Konsultasi Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function bookingJadwalBimbingan(data: BookingJadwalInput): Promise<ActionResponse> {
  const parsed = BookingJadwalSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { jadwalId, catatanMahasiswa } = parsed.data;

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

    const jadwal = await prisma.jadwalKonsultasi.findUnique({
      where: { id: jadwalId },
      select: {
        id: true,
        dosenId: true,
        kuota: true,
        _count: { select: { bookings: { where: { status: "Dipesan" } } } },
      },
    });

    // Validasi 4 : Cek apakah jadwal bimbingan ditemukan
    if (!jadwal) {
      return { success: false, message: "Jadwal bimbingan tidak ditemukan!" };
    }

    // Validasi 5 : Cek apakah jadwal milik dosen pembimbing mahasiswa sendiri
    const mahasiswaBookingUnassignedDosen = jadwal.dosenId !== mahasiswa.dosenId;

    if (mahasiswaBookingUnassignedDosen) {
      return { success: false, message: "Anda hanya bisa booking jadwal milik dosen pembimbing Anda!" };
    }

    // Validasi 6 : Cek apakah mahasiswa belum punya booking aktif (Dipesan) di jadwal yang sama
    const mahasiswaDidDoubleBooking = await prisma.bookingKonsultasi.findFirst({
      where: { jadwalId, mahasiswaId, status: "Dipesan" },
      select: { id: true },
    });

    if (mahasiswaDidDoubleBooking) {
      return { success: false, message: "Anda sudah memesan jadwal ini! Batalkan booking tersebut dulu sebelum memesan ulang." };
    }

    // Validasi 7 : Cek sisa kuota jadwal (jumlah booking aktif < kuota)
    const quotaIsFull = jadwal._count.bookings >= jadwal.kuota;

    if (quotaIsFull) {
      return { success: false, message: "Kuota jadwal ini sudah penuh!" };
    }

    await prisma.bookingKonsultasi.create({ data: { jadwalId, mahasiswaId, catatanMahasiswa, status: "Dipesan" } });

    return { success: true, message: "Jadwal bimbingan berhasil dipesan!" };
  } catch (error) {
    console.log("❌ Booking Jadwal Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function cancelBooking(id: string, data: CancelBookingInput): Promise<ActionResponse> {
  const session = await requireRole("Mahasiswa", "Dosen Pembimbing");

  const parsed = CancelBookingSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { alasanPembatalan } = parsed.data;

  try {
    const booking = await prisma.bookingKonsultasi.findUnique({
      where: { id },
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

    if (isMahasiswaCancel && booking.mahasiswaId !== session.userId) {
      return { success: false, message: "Anda tidak berhak membatalkan booking ini!" };
    }

    if (!isMahasiswaCancel && booking.jadwal.dosenId !== session.userId) {
      return { success: false, message: "Anda tidak berhak membatalkan booking ini!" };
    }

    await prisma.bookingKonsultasi.update({
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
