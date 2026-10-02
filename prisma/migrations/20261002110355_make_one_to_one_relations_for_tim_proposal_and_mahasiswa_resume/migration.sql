/*
  Warnings:

  - A unique constraint covering the columns `[tim_id]` on the table `proposal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mahasiswa_id]` on the table `resume` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "proposal_tim_id_key" ON "proposal"("tim_id");

-- CreateIndex
CREATE UNIQUE INDEX "resume_mahasiswa_id_key" ON "resume"("mahasiswa_id");
