/*
  Warnings:

  - Made the column `prodi_id` on table `dosen` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "dosen" DROP CONSTRAINT "dosen_prodi_id_fkey";

-- AlterTable
ALTER TABLE "dosen" ALTER COLUMN "prodi_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "dosen" ADD CONSTRAINT "dosen_prodi_id_fkey" FOREIGN KEY ("prodi_id") REFERENCES "prodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
