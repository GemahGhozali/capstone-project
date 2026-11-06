-- CreateEnum
CREATE TYPE "StatusKuesioner" AS ENUM ('Draf', 'Aktif', 'Ditutup');

-- CreateEnum
CREATE TYPE "TipePertanyaan" AS ENUM ('Likert', 'Esai');

-- CreateEnum
CREATE TYPE "StatusRespon" AS ENUM ('Draf', 'Selesai');

-- CreateTable
CREATE TABLE "kuesioner" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "judul" VARCHAR NOT NULL,
    "deskripsi" TEXT,
    "periode" VARCHAR NOT NULL,
    "status" "StatusKuesioner" NOT NULL DEFAULT 'Draf',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "kuesioner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bagian_kuesioner" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "kuesioner_id" UUID NOT NULL,
    "judul" VARCHAR NOT NULL,
    "urutan" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "bagian_kuesioner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pertanyaan_kuesioner" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "bagian_id" UUID NOT NULL,
    "tipe" "TipePertanyaan" NOT NULL DEFAULT 'Likert',
    "teks" TEXT NOT NULL,
    "wajib" BOOLEAN NOT NULL DEFAULT true,
    "urutan" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "pertanyaan_kuesioner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respon_kuesioner" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "kuesioner_id" UUID NOT NULL,
    "mahasiswa_id" UUID NOT NULL,
    "status" "StatusRespon" NOT NULL DEFAULT 'Draf',
    "submitted_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "respon_kuesioner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jawaban_kuesioner" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "respon_id" UUID NOT NULL,
    "pertanyaan_id" UUID NOT NULL,
    "nilai" SMALLINT,
    "jawaban_teks" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "jawaban_kuesioner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bagian_kuesioner_kuesioner_id_urutan_key" ON "bagian_kuesioner"("kuesioner_id", "urutan");

-- CreateIndex
CREATE UNIQUE INDEX "pertanyaan_kuesioner_bagian_id_urutan_key" ON "pertanyaan_kuesioner"("bagian_id", "urutan");

-- CreateIndex
CREATE UNIQUE INDEX "respon_kuesioner_kuesioner_id_mahasiswa_id_key" ON "respon_kuesioner"("kuesioner_id", "mahasiswa_id");

-- CreateIndex
CREATE UNIQUE INDEX "jawaban_kuesioner_respon_id_pertanyaan_id_key" ON "jawaban_kuesioner"("respon_id", "pertanyaan_id");

-- AddForeignKey
ALTER TABLE "bagian_kuesioner" ADD CONSTRAINT "bagian_kuesioner_kuesioner_id_fkey" FOREIGN KEY ("kuesioner_id") REFERENCES "kuesioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pertanyaan_kuesioner" ADD CONSTRAINT "pertanyaan_kuesioner_bagian_id_fkey" FOREIGN KEY ("bagian_id") REFERENCES "bagian_kuesioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respon_kuesioner" ADD CONSTRAINT "respon_kuesioner_kuesioner_id_fkey" FOREIGN KEY ("kuesioner_id") REFERENCES "kuesioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respon_kuesioner" ADD CONSTRAINT "respon_kuesioner_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jawaban_kuesioner" ADD CONSTRAINT "jawaban_kuesioner_respon_id_fkey" FOREIGN KEY ("respon_id") REFERENCES "respon_kuesioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jawaban_kuesioner" ADD CONSTRAINT "jawaban_kuesioner_pertanyaan_id_fkey" FOREIGN KEY ("pertanyaan_id") REFERENCES "pertanyaan_kuesioner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddCheckConstraint
ALTER TABLE "jawaban_kuesioner" ADD CONSTRAINT "jawaban_nilai_range" CHECK ("nilai" >= 1 AND "nilai" <= 5);
