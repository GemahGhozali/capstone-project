/*
  Warnings:

  - You are about to drop the column `file` on the `proposal` table. All the data in the column will be lost.
  - You are about to drop the column `file` on the `resume` table. All the data in the column will be lost.
  - Added the required column `file_name` to the `proposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_path` to the `proposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_size` to the `proposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_name` to the `resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_path` to the `resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_size` to the `resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "proposal" DROP COLUMN "file",
ADD COLUMN     "file_name" VARCHAR NOT NULL,
ADD COLUMN     "file_path" TEXT NOT NULL,
ADD COLUMN     "file_size" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "resume" DROP COLUMN "file",
ADD COLUMN     "file_name" VARCHAR NOT NULL,
ADD COLUMN     "file_path" TEXT NOT NULL,
ADD COLUMN     "file_size" INTEGER NOT NULL;
