-- Rename tabel
ALTER TABLE "jadwal_konsultasi" RENAME TO "jadwal_bimbingan";
ALTER TABLE "booking_konsultasi" RENAME TO "booking_bimbingan";

-- Rename enum type
ALTER TYPE "StatusBooking" RENAME TO "StatusBookingBimbingan";

-- Enum baru + kolom status di jadwal (existing rows jadi Aktif)
CREATE TYPE "StatusJadwalBimbingan" AS ENUM ('Aktif', 'Ditutup');
ALTER TABLE "jadwal_bimbingan"
  ADD COLUMN "status" "StatusJadwalBimbingan" NOT NULL DEFAULT 'Aktif';

-- Rename constraint
ALTER TABLE "jadwal_bimbingan" RENAME CONSTRAINT "jadwal_konsultasi_pkey" TO "jadwal_bimbingan_pkey";
ALTER TABLE "jadwal_bimbingan" RENAME CONSTRAINT "jadwal_konsultasi_dosen_id_fkey" TO "jadwal_bimbingan_dosen_id_fkey";
ALTER TABLE "booking_bimbingan" RENAME CONSTRAINT "booking_konsultasi_pkey" TO "booking_bimbingan_pkey";
ALTER TABLE "booking_bimbingan" RENAME CONSTRAINT "booking_konsultasi_jadwal_id_fkey" TO "booking_bimbingan_jadwal_id_fkey";
ALTER TABLE "booking_bimbingan" RENAME CONSTRAINT "booking_konsultasi_mahasiswa_id_fkey" TO "booking_bimbingan_mahasiswa_id_fkey";
