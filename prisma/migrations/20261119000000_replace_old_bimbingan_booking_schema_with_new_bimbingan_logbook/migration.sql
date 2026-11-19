-- CreateEnum
CREATE TYPE "StatusBimbingan" AS ENUM ('Menunggu', 'Disetujui', 'Ditolak');

-- DropForeignKey
ALTER TABLE "booking_bimbingan" DROP CONSTRAINT "booking_bimbingan_jadwal_id_fkey";

-- DropForeignKey
ALTER TABLE "booking_bimbingan" DROP CONSTRAINT "booking_bimbingan_mahasiswa_id_fkey";

-- DropForeignKey
ALTER TABLE "jadwal_bimbingan" DROP CONSTRAINT "jadwal_bimbingan_dosen_id_fkey";

-- DropTable
DROP TABLE "booking_bimbingan";

-- DropTable
DROP TABLE "jadwal_bimbingan";

-- DropEnum
DROP TYPE "DibatalkanOleh";

-- DropEnum
DROP TYPE "StatusBookingBimbingan";

-- DropEnum
DROP TYPE "StatusJadwalBimbingan";

-- CreateTable
CREATE TABLE "bimbingan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mahasiswa_id" UUID NOT NULL,
    "dosen_id" UUID,
    "tanggal" DATE NOT NULL,
    "catatan" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_name" VARCHAR NOT NULL,
    "file_size" INTEGER NOT NULL,
    "status" "StatusBimbingan" NOT NULL DEFAULT 'Menunggu',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "bimbingan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bimbingan_mahasiswa_id_status_idx" ON "bimbingan"("mahasiswa_id", "status");

-- CreateIndex
CREATE INDEX "bimbingan_dosen_id_status_idx" ON "bimbingan"("dosen_id", "status");

-- CreateIndex
CREATE INDEX "bimbingan_tanggal_idx" ON "bimbingan"("tanggal");

-- AddForeignKey
ALTER TABLE "bimbingan" ADD CONSTRAINT "bimbingan_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bimbingan" ADD CONSTRAINT "bimbingan_dosen_id_fkey" FOREIGN KEY ("dosen_id") REFERENCES "dosen"("id") ON DELETE SET NULL ON UPDATE CASCADE;
