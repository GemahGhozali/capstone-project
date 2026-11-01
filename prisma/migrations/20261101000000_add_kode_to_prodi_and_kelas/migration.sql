/*
  Warnings:

  - You are about to alter the column `kode` on the `kelas` table. The data in that column could be lost.
  - You are about to alter the column `kode` on the `prodi` table. The data in that column could be lost.

*/
-- AlterTable
ALTER TABLE "kelas" ADD COLUMN "kode" VARCHAR(20);

-- BackfillKode
UPDATE "kelas" SET "kode" = CASE
  WHEN "nama" = 'Kelas A' AND "angkatan" = 2024 THEN 'A24'
  WHEN "nama" = 'Kelas B' AND "angkatan" = 2024 THEN 'B24'
END;

ALTER TABLE "kelas" ALTER COLUMN "kode" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "kelas_kode_key" ON "kelas"("kode");

-- AlterTable
ALTER TABLE "prodi" ADD COLUMN "kode" VARCHAR(20);

-- BackfillKode
UPDATE "prodi" SET "kode" = CASE
  WHEN "nama" = 'D3 Teknik Informatika' THEN 'TI'
  WHEN "nama" = 'D3 Teknik Komputer' THEN 'TK'
  WHEN "nama" = 'D4 Teknik Informatika Multimedia' THEN 'TIM'
  WHEN "nama" = 'D4 Teknologi Rekayasa Komputer' THEN 'TRK'
END;

ALTER TABLE "prodi" ALTER COLUMN "kode" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "prodi_kode_key" ON "prodi"("kode");
