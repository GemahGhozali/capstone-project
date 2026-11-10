"use server";

import {
  findUncompleteBagian,
  checkIsBagianComplete,
  validateJawabanEntries,
  ensureMahasiswaCanFillKuesioner,
  getActiveKuesionerAndMahasiswaResponse,
} from "./services";

import { prisma } from "@/libs/prisma";
import { formatZodError } from "@/utils/format-zod-error";
import { ActionResponse } from "@/types";
import { userIsValidAndHasRole } from "@/libs/dal";
import { BagianInput, KuesionerInput, PertanyaanInput, BagianJawabanInput } from "./schemas";
import { BagianSchema, KuesionerSchema, PertanyaanSchema, BagianJawabanSchema } from "./schemas";

export async function createKuesioner(data: KuesionerInput): Promise<ActionResponse<{ id: string }>> {
  const parsed = KuesionerSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { judul, periode, deskripsi } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    const kuesioner = await prisma.kuesioner.create({ data: { judul, periode, deskripsi: deskripsi || null } });

    return { success: true, message: "Kuesioner berhasil dibuat!", data: { id: kuesioner.id } };
  } catch (error) {
    console.log("❌ Create Kuesioner Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function updateKuesioner(id: string, data: KuesionerInput): Promise<ActionResponse<{ id: string }>> {
  const parsed = KuesionerSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { judul, periode, deskripsi } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    const kuesioner = await prisma.kuesioner.findUnique({ where: { id }, select: { status: true } });

    if (!kuesioner) {
      return { success: false, message: "Kuesioner tidak ditemukan!" };
    }

    if (kuesioner.status !== "Draf") {
      return { success: false, message: "Kuesioner hanya bisa diubah saat berstatus Draf!" };
    }

    await prisma.kuesioner.update({ where: { id }, data: { judul, periode, deskripsi: deskripsi || null } });

    return { success: true, message: "Kuesioner berhasil diperbaharui!", data: { id } };
  } catch (error) {
    console.log("❌ Update Kuesioner Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function deleteKuesioner(id: string): Promise<ActionResponse> {
  try {
    await userIsValidAndHasRole("Kaprodi");

    const kuesioner = await prisma.kuesioner.findUnique({ where: { id }, select: { status: true } });

    if (!kuesioner) {
      return { success: false, message: "Kuesioner tidak ditemukan!" };
    }

    if (kuesioner.status !== "Draf") {
      return { success: false, message: "Kuesioner hanya bisa dihapus saat berstatus Draf!" };
    }

    await prisma.kuesioner.delete({ where: { id } });

    return { success: true, message: "Kuesioner berhasil dihapus!" };
  } catch (error) {
    console.log("❌ Delete Kuesioner Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function addBagian(kuesionerId: string, data: BagianInput): Promise<ActionResponse> {
  const parsed = BagianSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { judul } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    const kuesioner = await prisma.kuesioner.findUnique({ where: { id: kuesionerId }, select: { status: true } });

    if (!kuesioner) {
      return { success: false, message: "Kuesioner tidak ditemukan!" };
    }

    if (kuesioner.status !== "Draf") {
      return { success: false, message: "Struktur kuesioner terkunci! Bagian hanya bisa ditambah saat berstatus Draf." };
    }

    await prisma.$transaction(async (transaction) => {
      const lastPartOrder = await transaction.bagianKuesioner.aggregate({ where: { kuesionerId }, _max: { urutan: true } });

      const urutan = (lastPartOrder._max.urutan ?? 0) + 1;

      await transaction.bagianKuesioner.create({ data: { kuesionerId, judul, urutan } });
    });

    return { success: true, message: "Bagian berhasil ditambahkan!" };
  } catch (error) {
    console.log("❌ Add Bagian Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function updateBagian(bagianId: string, data: BagianInput): Promise<ActionResponse> {
  const parsed = BagianSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { judul } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    const bagian = await prisma.bagianKuesioner.findUnique({
      where: { id: bagianId },
      select: { kuesioner: { select: { status: true } } },
    });

    if (!bagian) {
      return { success: false, message: "Bagian tidak ditemukan!" };
    }

    if (bagian.kuesioner.status !== "Draf") {
      return { success: false, message: "Struktur kuesioner terkunci! Bagian hanya bisa diubah saat berstatus Draf." };
    }

    await prisma.bagianKuesioner.update({ where: { id: bagianId }, data: { judul } });

    return { success: true, message: "Bagian berhasil diperbaharui!" };
  } catch (error) {
    console.log("❌ Update Bagian Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function deleteBagian(bagianId: string): Promise<ActionResponse> {
  try {
    await userIsValidAndHasRole("Kaprodi");

    const bagian = await prisma.bagianKuesioner.findUnique({
      where: { id: bagianId },
      select: { kuesioner: { select: { status: true } } },
    });

    if (!bagian) {
      return { success: false, message: "Bagian tidak ditemukan!" };
    }

    if (bagian.kuesioner.status !== "Draf") {
      return { success: false, message: "Struktur kuesioner terkunci! Bagian hanya bisa dihapus saat berstatus Draf." };
    }

    await prisma.bagianKuesioner.delete({ where: { id: bagianId } });

    return { success: true, message: "Bagian berhasil dihapus!" };
  } catch (error) {
    console.log("❌ Delete Bagian Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function addPertanyaan(bagianId: string, data: PertanyaanInput): Promise<ActionResponse> {
  const parsed = PertanyaanSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { teks, tipe, wajib: isRequired } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    const bagian = await prisma.bagianKuesioner.findUnique({
      where: { id: bagianId },
      select: { kuesioner: { select: { status: true } } },
    });

    if (!bagian) {
      return { success: false, message: "Bagian tidak ditemukan!" };
    }

    if (bagian.kuesioner.status !== "Draf") {
      return { success: false, message: "Struktur kuesioner terkunci! Pertanyaan hanya bisa ditambah saat berstatus Draf." };
    }

    await prisma.$transaction(async (transaction) => {
      const lastQuestionOrder = await transaction.pertanyaanKuesioner.aggregate({ where: { bagianId }, _max: { urutan: true } });

      const urutan = (lastQuestionOrder._max.urutan ?? 0) + 1;

      await transaction.pertanyaanKuesioner.create({ data: { bagianId, teks, tipe, urutan, wajib: isRequired ?? true } });
    });

    return { success: true, message: "Pertanyaan berhasil ditambahkan!" };
  } catch (error) {
    console.log("❌ Add Pertanyaan Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function updatePertanyaan(pertanyaanId: string, data: PertanyaanInput): Promise<ActionResponse> {
  const parsed = PertanyaanSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { teks, tipe, wajib: isRequired } = parsed.data;

  try {
    await userIsValidAndHasRole("Kaprodi");

    const pertanyaan = await prisma.pertanyaanKuesioner.findUnique({
      where: { id: pertanyaanId },
      select: { bagian: { select: { kuesioner: { select: { status: true } } } } },
    });

    if (!pertanyaan) {
      return { success: false, message: "Pertanyaan tidak ditemukan!" };
    }

    if (pertanyaan.bagian.kuesioner.status !== "Draf") {
      return { success: false, message: "Struktur kuesioner terkunci! Pertanyaan hanya bisa diubah saat berstatus Draf." };
    }

    await prisma.pertanyaanKuesioner.update({ where: { id: pertanyaanId }, data: { teks, tipe, wajib: isRequired ?? true } });

    return { success: true, message: "Pertanyaan berhasil diperbaharui!" };
  } catch (error) {
    console.log("❌ Update Pertanyaan Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function deletePertanyaan(pertanyaanId: string): Promise<ActionResponse> {
  try {
    await userIsValidAndHasRole("Kaprodi");

    const pertanyaan = await prisma.pertanyaanKuesioner.findUnique({
      where: { id: pertanyaanId },
      select: { bagian: { select: { kuesioner: { select: { status: true } } } } },
    });

    if (!pertanyaan) {
      return { success: false, message: "Pertanyaan tidak ditemukan!" };
    }

    if (pertanyaan.bagian.kuesioner.status !== "Draf") {
      return { success: false, message: "Struktur kuesioner terkunci! Pertanyaan hanya bisa dihapus saat berstatus Draf." };
    }

    await prisma.pertanyaanKuesioner.delete({ where: { id: pertanyaanId } });

    return { success: true, message: "Pertanyaan berhasil dihapus!" };
  } catch (error) {
    console.log("❌ Delete Pertanyaan Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function publishKuesioner(id: string): Promise<ActionResponse> {
  try {
    await userIsValidAndHasRole("Kaprodi");

    const kuesioner = await prisma.kuesioner.findUnique({
      where: { id },
      select: {
        judul: true,
        periode: true,
        status: true,
        bagian: { select: { judul: true, _count: { select: { pertanyaan: true } } }, orderBy: { urutan: "asc" } },
      },
    });

    if (!kuesioner) {
      return { success: false, message: "Kuesioner tidak ditemukan!" };
    }

    if (kuesioner.status !== "Draf") {
      return { success: false, message: "Kuesioner hanya bisa dipublish saat berstatus Draf!" };
    }

    if (kuesioner.bagian.length === 0) {
      return { success: false, message: "Kuesioner masih kosong! Silahkan lengkapi bagian dan pertanyaan kuesioner sebelum di publish!" };
    }

    const emptyBagian = kuesioner.bagian.find((bagian) => bagian._count.pertanyaan === 0);

    if (emptyBagian) {
      return { success: false, message: `Publish kuesiner gagal! Bagian "${emptyBagian.judul}" belum memiliki pertanyaan!` };
    }

    await prisma.kuesioner.update({ where: { id }, data: { status: "Aktif" } });

    return { success: true, message: "Kuesioner berhasil dipublish!" };
  } catch (error) {
    console.log("❌ Publish Kuesioner Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function closeKuesioner(id: string): Promise<ActionResponse> {
  try {
    await userIsValidAndHasRole("Kaprodi");

    const kuesioner = await prisma.kuesioner.findUnique({ where: { id }, select: { status: true } });

    if (!kuesioner) {
      return { success: false, message: "Kuesioner tidak ditemukan!" };
    }

    if (kuesioner.status !== "Aktif") {
      return { success: false, message: "Kuesioner hanya bisa ditutup saat berstatus Aktif!" };
    }

    await prisma.kuesioner.update({ where: { id }, data: { status: "Ditutup" } });

    return { success: true, message: "Kuesioner berhasil ditutup!" };
  } catch (error) {
    console.log("❌ Close Kuesioner Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function duplicateKuesioner(id: string): Promise<ActionResponse> {
  try {
    await userIsValidAndHasRole("Kaprodi");

    const kuesioner = await prisma.kuesioner.findUnique({
      where: { id },
      select: {
        judul: true,
        deskripsi: true,
        periode: true,
        bagian: {
          orderBy: { urutan: "asc" },
          select: {
            judul: true,
            urutan: true,
            pertanyaan: {
              orderBy: { urutan: "asc" },
              select: { teks: true, tipe: true, wajib: true, urutan: true },
            },
          },
        },
      },
    });

    if (!kuesioner) {
      return { success: false, message: "Kuesioner tidak ditemukan!" };
    }

    await prisma.kuesioner.create({
      data: {
        judul: `${kuesioner.judul} (Duplikat)`,
        periode: kuesioner.periode,
        deskripsi: kuesioner.deskripsi,
        bagian: {
          create: kuesioner.bagian.map((bagian) => ({
            judul: bagian.judul,
            urutan: bagian.urutan,
            pertanyaan: {
              create: bagian.pertanyaan.map((pertanyaan) => ({
                teks: pertanyaan.teks,
                tipe: pertanyaan.tipe,
                wajib: pertanyaan.wajib,
                urutan: pertanyaan.urutan,
              })),
            },
          })),
        },
      },
    });

    return { success: true, message: "Kuesioner berhasil diduplikat!" };
  } catch (error) {
    console.log("❌ Duplicate Kuesioner Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function saveBagianJawaban(kuesionerId: string, data: BagianJawabanInput): Promise<ActionResponse<{ isBagianComplete: boolean }>> {
  const parsed = BagianJawabanSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, message: "Data tidak valid!", errors: formatZodError(parsed.error) };
  }

  const { bagianId, jawaban } = parsed.data;

  try {
    const { id: mahasiswaId } = await userIsValidAndHasRole("Mahasiswa");

    const eligibilityValidation = await ensureMahasiswaCanFillKuesioner(mahasiswaId);

    if (!eligibilityValidation.isValid) {
      return { success: false, message: eligibilityValidation.message };
    }

    const kuesioner = await getActiveKuesionerAndMahasiswaResponse(kuesionerId, mahasiswaId);

    if (!kuesioner) {
      return { success: false, message: "Kuesioner tidak ditemukan atau sudah tidak aktif!" };
    }

    const existingResponse = kuesioner.respon[0] ?? null;

    const responseIsLocked = existingResponse?.status === "Selesai";

    if (responseIsLocked) {
      return { success: false, message: "Jawaban kuesioner sudah terkirim dan tidak bisa diubah lagi!" };
    }

    const bagian = kuesioner.bagian.find((item) => item.id === bagianId);

    if (!bagian) {
      return { success: false, message: "Bagian kuesioner tidak ditemukan pada kuesioner ini!" };
    }

    const jawabanValidation = validateJawabanEntries(jawaban, bagian.pertanyaan);

    if (!jawabanValidation.isValid) {
      return { success: false, message: jawabanValidation.message };
    }

    const pertanyaanIds = bagian.pertanyaan.map((pertanyaan) => pertanyaan.id);
    const submittedJawabanIds = jawaban.map((entry) => entry.pertanyaanId);
    const pertanyaanMap = new Map(bagian.pertanyaan.map((item) => [item.id, item]));

    await prisma.$transaction(async (transaction) => {
      const respon = existingResponse ?? (await transaction.responKuesioner.create({ data: { kuesionerId, mahasiswaId, status: "Draf" } }));

      for (const entry of jawaban) {
        const pertanyaan = pertanyaanMap.get(entry.pertanyaanId)!;
        const isLikert = pertanyaan.tipe === "Likert";
        const isEsai = pertanyaan.tipe === "Esai";

        await transaction.jawabanKuesioner.upsert({
          where: { responId_pertanyaanId: { responId: respon.id, pertanyaanId: entry.pertanyaanId } },
          create: {
            responId: respon.id,
            pertanyaanId: entry.pertanyaanId,
            nilai: isLikert ? entry.nilai : null,
            jawabanTeks: isEsai ? entry.jawabanTeks : null,
          },
          update: {
            nilai: isLikert ? entry.nilai : null,
            jawabanTeks: isEsai ? entry.jawabanTeks : null,
          },
        });
      }

      await transaction.jawabanKuesioner.deleteMany({
        where: {
          responId: respon.id,
          pertanyaanId: { in: pertanyaanIds, notIn: submittedJawabanIds },
        },
      });
    });

    const isBagianComplete = checkIsBagianComplete(bagian.pertanyaan, jawaban);

    return { success: true, message: "Jawaban bagian berhasil disimpan!", data: { isBagianComplete } };
  } catch (error) {
    console.log("❌ Save Bagian Jawaban Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}

export async function submitKuesioner(kuesionerId: string): Promise<ActionResponse<{ bagianId: string; pertanyaanId: string }>> {
  try {
    const { id: mahasiswaId } = await userIsValidAndHasRole("Mahasiswa");

    const eligibility = await ensureMahasiswaCanFillKuesioner(mahasiswaId);

    if (!eligibility.isValid) {
      return { success: false, message: eligibility.message };
    }

    const kuesioner = await getActiveKuesionerAndMahasiswaResponse(kuesionerId, mahasiswaId);

    if (!kuesioner) {
      return { success: false, message: "Kuesioner tidak ditemukan atau sudah tidak aktif!" };
    }

    const respon = kuesioner.respon[0];

    if (!respon) {
      return { success: false, message: "Anda belum mengisi kuesioner ini!" };
    }

    if (respon.status === "Selesai") {
      return { success: false, message: "Jawaban kuesioner sudah terkirim sebelumnya!" };
    }

    const uncompleteBagian = findUncompleteBagian(kuesioner.bagian, respon.jawaban);

    if (uncompleteBagian) {
      const { pertanyaanId, pertanyaanTeks, bagianId, bagianJudul } = uncompleteBagian;
      return {
        success: false,
        message: `Kirim jawaban gagal! Pertanyaan "${pertanyaanTeks}" pada bagian "${bagianJudul}" belum dijawab.`,
        data: { bagianId: bagianId, pertanyaanId: pertanyaanId },
      };
    }

    await prisma.responKuesioner.update({
      where: { id: respon.id },
      data: { status: "Selesai", submittedAt: new Date() },
    });

    return { success: true, message: "Jawaban kuesioner berhasil dikirim!" };
  } catch (error) {
    console.log("❌ Submit Kuesioner Error :", error);
    return { success: false, message: "Terjadi kesalahan pada server!" };
  }
}
