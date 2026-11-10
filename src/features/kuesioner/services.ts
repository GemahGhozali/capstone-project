import "server-only";

import { prisma } from "@/libs/prisma";
import { JawabanKuesioner, PertanyaanKuesioner } from "@/generated/prisma/client";
import { JawabanEsaiSchema, JawabanInput, JawabanLikertSchema } from "./schemas";

type Pertanyaan = Pick<PertanyaanKuesioner, "id" | "wajib" | "tipe" | "teks">;
type Jawaban = Pick<JawabanKuesioner, "pertanyaanId" | "jawabanTeks" | "nilai">;

function checkIsJawabanValid(pertanyaan: Pertanyaan, jawaban?: Jawaban): boolean {
  if (!jawaban) return false;
  const jawabanValidation = pertanyaan.tipe === "Likert" ? JawabanLikertSchema.safeParse(jawaban) : JawabanEsaiSchema.safeParse(jawaban);
  return jawabanValidation.success;
}

export function checkIsBagianComplete(pertanyaan: Pertanyaan[], jawaban: Jawaban[]): boolean {
  const jawabanMap = new Map(jawaban.map((jawaban) => [jawaban.pertanyaanId, jawaban]));

  const requiredQuestion = pertanyaan.filter((pertanyaan) => pertanyaan.wajib);

  const everyRequiredQuestionHasValidJawaban = requiredQuestion.every((pertanyaan) => {
    const jawaban = jawabanMap.get(pertanyaan.id);
    return checkIsJawabanValid(pertanyaan, jawaban);
  });

  return everyRequiredQuestionHasValidJawaban;
}

export async function ensureMahasiswaCanFillKuesioner(mahasiswaId: string) {
  const mahasiswa = await prisma.mahasiswa.findUnique({
    where: { id: mahasiswaId },
    select: {
      id: true,
      status: true,
      user: { select: { isActive: true } },
      resume: { select: { status: true } },
    },
  });

  if (!mahasiswa) {
    return { isValid: false, message: "Anda tidak terdaftar sebagai mahasiswa!" };
  }

  const mahasiswaIsNotActive = mahasiswa.status !== "Aktif" || !mahasiswa.user.isActive;

  if (mahasiswaIsNotActive) {
    return { isValid: false, message: "Anda bukan mahasiswa berstatus aktif!" };
  }

  const mahasiswaResumeIsNotApproved = mahasiswa.resume?.status !== "Disetujui";

  if (mahasiswaResumeIsNotApproved) {
    return { isValid: false, message: "Resume anda belum disetujui! Anda belum bisa mengisi kuesioner." };
  }

  return { isValid: true, message: "Mahasiswa valid untuk mengisi kuesioner!" };
}

export function validateJawabanEntries(entries: JawabanInput[], pertanyaanBagian: { id: string; teks: string; tipe: "Likert" | "Esai" }[]) {
  const pertanyaanMap = new Map(pertanyaanBagian.map((pertanyaan) => [pertanyaan.id, pertanyaan]));

  for (const entry of entries) {
    const pertanyaan = pertanyaanMap.get(entry.pertanyaanId);

    if (!pertanyaan) {
      return { isValid: false, message: "Jawaban tidak sesuai dengan pertanyaan manapun di bagian ini!" };
    }

    const isLikert = pertanyaan.tipe === "Likert";
    const validation = isLikert ? JawabanLikertSchema.safeParse(entry) : JawabanEsaiSchema.safeParse(entry);

    if (!validation.success) {
      return {
        isValid: false,
        message: `Jawaban "${pertanyaan.teks}" ${isLikert ? "harus berupa pilihan Likert (1-5)!" : "harus berupa jawaban esai!"}`,
      };
    }
  }

  const questionIds = entries.map((entry) => entry.pertanyaanId);
  const uniqueQuestionIds = new Set(questionIds);
  const hasDuplicateAnswers = questionIds.length !== uniqueQuestionIds.size;

  if (hasDuplicateAnswers) {
    return { isValid: false, message: "Terdapat jawaban yang dikirim dua kali untuk pertanyaan yang sama!" };
  }

  return { isValid: true, message: "Semua jawaban valid!" };
}

export function findUncompleteBagian(bagianList: { id: string; judul: string; pertanyaan: Pertanyaan[] }[], jawaban: Jawaban[]) {
  const jawabanMap = new Map(jawaban.map((jawaban) => [jawaban.pertanyaanId, jawaban]));

  for (const bagian of bagianList) {
    const pertanyaanIsRequiredButJawabanIsNotValid = bagian.pertanyaan.find((pertanyaan) => {
      const jawaban = jawabanMap.get(pertanyaan.id);
      const jawabanIsNotValid = !checkIsJawabanValid(pertanyaan, jawaban);
      const pertanyaanIsRequired = pertanyaan.wajib;

      return pertanyaanIsRequired && jawabanIsNotValid;
    });

    if (pertanyaanIsRequiredButJawabanIsNotValid) {
      const { id, teks } = pertanyaanIsRequiredButJawabanIsNotValid;

      return { bagianId: bagian.id, bagianJudul: bagian.judul, pertanyaanId: id, pertanyaanTeks: teks };
    }
  }

  return null;
}

export async function getActiveKuesionerAndMahasiswaResponse(kuesionerId: string, mahasiswaId: string) {
  return prisma.kuesioner.findFirst({
    where: { id: kuesionerId, status: "Aktif" },
    select: {
      id: true,
      status: true,
      bagian: {
        orderBy: { urutan: "asc" },
        select: {
          id: true,
          judul: true,
          urutan: true,
          pertanyaan: {
            orderBy: { urutan: "asc" },
            select: { id: true, teks: true, tipe: true, wajib: true, urutan: true },
          },
        },
      },
      respon: {
        where: { mahasiswaId },
        select: {
          id: true,
          status: true,
          jawaban: { select: { pertanyaanId: true, nilai: true, jawabanTeks: true } },
        },
      },
    },
  });
}
