-- CreateEnum
CREATE TYPE "StatusMahasiswa" AS ENUM ('Aktif', 'Nonaktif', 'Arsip');

-- CreateEnum
CREATE TYPE "StatusDosen" AS ENUM ('Aktif', 'Nonaktif', 'Pindah');

-- CreateEnum
CREATE TYPE "StatusDosenPembimbingDetail" AS ENUM ('Buka', 'Tutup');

-- CreateEnum
CREATE TYPE "PeranAnggotaTim" AS ENUM ('Ketua', 'Anggota');

-- CreateEnum
CREATE TYPE "KategoriCapstone" AS ENUM ('EPD', 'SM');

-- CreateEnum
CREATE TYPE "StatusPersetujuan" AS ENUM ('Menunggu', 'Disetujui');

-- CreateEnum
CREATE TYPE "StatusProposal" AS ENUM ('Menunggu', 'Disetujui', 'Ditolak', 'Revisi');

-- CreateEnum
CREATE TYPE "StatusResume" AS ENUM ('Menunggu', 'Disetujui', 'Ditolak');

-- CreateEnum
CREATE TYPE "StatusBooking" AS ENUM ('Dipesan', 'Dibatalkan', 'Selesai');

-- CreateEnum
CREATE TYPE "DibatalkanOleh" AS ENUM ('Mahasiswa', 'Dosen');

-- CreateEnum
CREATE TYPE "EntityLog" AS ENUM ('Tim', 'Proposal', 'Resume');

-- CreateEnum
CREATE TYPE "WarnaLog" AS ENUM ('Neutral', 'Danger', 'Warning', 'Success', 'Info');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "identifier" VARCHAR NOT NULL,
    "password" TEXT NOT NULL,
    "nama_lengkap" VARCHAR NOT NULL,
    "alamat_email" VARCHAR NOT NULL,
    "foto_profil" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_password_changed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_token" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "used_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "password_reset_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nama" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_role" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prodi" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nama" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "prodi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mahasiswa" (
    "id" UUID NOT NULL,
    "nim" VARCHAR NOT NULL,
    "kelas" VARCHAR NOT NULL,
    "angkatan" VARCHAR NOT NULL,
    "tanggal_masuk" DATE NOT NULL,
    "status" "StatusMahasiswa" NOT NULL,
    "dosen_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "mahasiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dosen" (
    "id" UUID NOT NULL,
    "nip" VARCHAR NOT NULL,
    "bidang_keahlian" VARCHAR NOT NULL,
    "status" "StatusDosen" NOT NULL,
    "prodi_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "dosen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dosen_pembimbing_detail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "dosen_id" UUID NOT NULL,
    "batas_bimbingan" INTEGER NOT NULL,
    "status" "StatusDosenPembimbingDetail" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "dosen_pembimbing_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tim" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nama" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "tim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anggota_tim" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tim_id" UUID NOT NULL,
    "mahasiswa_id" UUID NOT NULL,
    "peran" "PeranAnggotaTim" NOT NULL,
    "kategori_capstone" "KategoriCapstone" NOT NULL,
    "status_persetujuan" "StatusPersetujuan" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "anggota_tim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tim_id" UUID NOT NULL,
    "judul" VARCHAR NOT NULL,
    "mitra" VARCHAR NOT NULL,
    "file" TEXT NOT NULL,
    "status" "StatusProposal" NOT NULL DEFAULT 'Menunggu',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposal_review" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "proposal_id" UUID NOT NULL,
    "dosen_id" UUID,
    "catatan" TEXT NOT NULL,
    "status" "StatusProposal" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "proposal_review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "proposal_id" UUID NOT NULL,
    "mahasiswa_id" UUID NOT NULL,
    "dosen_id" UUID,
    "subjudul" VARCHAR NOT NULL,
    "file" TEXT NOT NULL,
    "status" "StatusResume" NOT NULL DEFAULT 'Menunggu',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_review" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "dosen_id" UUID,
    "resume_id" UUID NOT NULL,
    "catatan" TEXT NOT NULL,
    "status" "StatusResume" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "resume_review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jadwal_konsultasi" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "dosen_id" UUID NOT NULL,
    "tanggal" DATE NOT NULL,
    "jam_mulai" TIME NOT NULL,
    "jam_tutup" TIME NOT NULL,
    "kuota" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "jadwal_konsultasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_konsultasi" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "jadwal_id" UUID NOT NULL,
    "mahasiswa_id" UUID NOT NULL,
    "catatan_mahasiswa" TEXT NOT NULL,
    "catatan_dosen" TEXT,
    "status" "StatusBooking" NOT NULL,
    "tanggal_pembatalan" TIMESTAMPTZ,
    "alasan_pembatalan" TEXT,
    "dibatalkan_oleh" "DibatalkanOleh",
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "booking_konsultasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "entity" "EntityLog" NOT NULL,
    "entity_id" UUID NOT NULL,
    "user_id" UUID,
    "pesan" TEXT NOT NULL,
    "warna" "WarnaLog" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_identifier_key" ON "user"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "user_alamat_email_key" ON "user"("alamat_email");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_token_user_id_key" ON "password_reset_token"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_nama_key" ON "role"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "user_role_user_id_role_id_key" ON "user_role"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "prodi_nama_key" ON "prodi"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "mahasiswa_nim_key" ON "mahasiswa"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "dosen_nip_key" ON "dosen"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "dosen_pembimbing_detail_dosen_id_key" ON "dosen_pembimbing_detail"("dosen_id");

-- CreateIndex
CREATE UNIQUE INDEX "tim_nama_key" ON "tim"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "anggota_tim_mahasiswa_id_key" ON "anggota_tim"("mahasiswa_id");

-- AddForeignKey
ALTER TABLE "password_reset_token" ADD CONSTRAINT "password_reset_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa" ADD CONSTRAINT "mahasiswa_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa" ADD CONSTRAINT "mahasiswa_dosen_id_fkey" FOREIGN KEY ("dosen_id") REFERENCES "dosen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dosen" ADD CONSTRAINT "dosen_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dosen" ADD CONSTRAINT "dosen_prodi_id_fkey" FOREIGN KEY ("prodi_id") REFERENCES "prodi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dosen_pembimbing_detail" ADD CONSTRAINT "dosen_pembimbing_detail_dosen_id_fkey" FOREIGN KEY ("dosen_id") REFERENCES "dosen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anggota_tim" ADD CONSTRAINT "anggota_tim_tim_id_fkey" FOREIGN KEY ("tim_id") REFERENCES "tim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anggota_tim" ADD CONSTRAINT "anggota_tim_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal" ADD CONSTRAINT "proposal_tim_id_fkey" FOREIGN KEY ("tim_id") REFERENCES "tim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_review" ADD CONSTRAINT "proposal_review_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposal_review" ADD CONSTRAINT "proposal_review_dosen_id_fkey" FOREIGN KEY ("dosen_id") REFERENCES "dosen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume" ADD CONSTRAINT "resume_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume" ADD CONSTRAINT "resume_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume" ADD CONSTRAINT "resume_dosen_id_fkey" FOREIGN KEY ("dosen_id") REFERENCES "dosen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_review" ADD CONSTRAINT "resume_review_dosen_id_fkey" FOREIGN KEY ("dosen_id") REFERENCES "dosen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_review" ADD CONSTRAINT "resume_review_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal_konsultasi" ADD CONSTRAINT "jadwal_konsultasi_dosen_id_fkey" FOREIGN KEY ("dosen_id") REFERENCES "dosen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_konsultasi" ADD CONSTRAINT "booking_konsultasi_jadwal_id_fkey" FOREIGN KEY ("jadwal_id") REFERENCES "jadwal_konsultasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_konsultasi" ADD CONSTRAINT "booking_konsultasi_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_log" ADD CONSTRAINT "activity_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
