/*
  Warnings:

  - You are about to drop the column `angkatan` on the `mahasiswa` table. All the data in the column will be lost.
  - You are about to drop the column `kelas` on the `mahasiswa` table. All the data in the column will be lost.
  - Added the required column `kelas_id` to the `mahasiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mahasiswa" DROP COLUMN "angkatan",
DROP COLUMN "kelas",
ADD COLUMN     "kelas_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "kelas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nama" VARCHAR(20) NOT NULL,
    "angkatan" SMALLINT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "kelas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kelas_nama_angkatan_key" ON "kelas"("nama", "angkatan");

-- AddForeignKey
ALTER TABLE "mahasiswa" ADD CONSTRAINT "mahasiswa_kelas_id_fkey" FOREIGN KEY ("kelas_id") REFERENCES "kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
