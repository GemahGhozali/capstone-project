-- CreateTable
CREATE TABLE "penilaian" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "mahasiswa_id" UUID NOT NULL,
    "nilai" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "penilaian_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "penilaian_mahasiswa_id_key" ON "penilaian"("mahasiswa_id");

-- AddForeignKey
ALTER TABLE "penilaian" ADD CONSTRAINT "penilaian_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddCheckConstraint
ALTER TABLE "penilaian" ADD CONSTRAINT "penilaian_nilai_range" CHECK ("nilai" >= 0 AND "nilai" <= 100);
