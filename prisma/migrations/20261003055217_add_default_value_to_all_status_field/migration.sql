-- AlterTable
ALTER TABLE "anggota_tim" ALTER COLUMN "status_persetujuan" SET DEFAULT 'Menunggu';

-- AlterTable
ALTER TABLE "booking_konsultasi" ALTER COLUMN "status" SET DEFAULT 'Dipesan';

-- AlterTable
ALTER TABLE "dosen" ALTER COLUMN "status" SET DEFAULT 'Aktif';

-- AlterTable
ALTER TABLE "dosen_pembimbing_detail" ALTER COLUMN "status" SET DEFAULT 'Buka';

-- AlterTable
ALTER TABLE "mahasiswa" ALTER COLUMN "status" SET DEFAULT 'Aktif';
