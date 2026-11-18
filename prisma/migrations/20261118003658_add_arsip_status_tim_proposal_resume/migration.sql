/*
  Warnings:

  - Changed the type of `status` on the `proposal_review` and `resume_review` tables.
    Fixed manually: values are compatible 1:1, converted with a `USING` cast instead of drop/recreate.

*/
-- CreateEnum
CREATE TYPE "StatusReviewProposal" AS ENUM ('Menunggu', 'Disetujui', 'Ditolak', 'Revisi');

-- CreateEnum
CREATE TYPE "StatusReviewResume" AS ENUM ('Menunggu', 'Disetujui', 'Ditolak');

-- CreateEnum
CREATE TYPE "StatusTim" AS ENUM ('Aktif', 'Arsip');

-- AlterEnum
ALTER TYPE "StatusProposal" ADD VALUE 'Arsip';

-- AlterEnum
ALTER TYPE "StatusResume" ADD VALUE 'Arsip';

-- AlterTable
ALTER TABLE "proposal_review" ALTER COLUMN "status" SET DATA TYPE "StatusReviewProposal" USING "status"::text::"StatusReviewProposal";

-- AlterTable
ALTER TABLE "resume_review" ALTER COLUMN "status" SET DATA TYPE "StatusReviewResume" USING "status"::text::"StatusReviewResume";

-- AlterTable
ALTER TABLE "tim" ADD COLUMN     "status" "StatusTim" NOT NULL DEFAULT 'Aktif';
