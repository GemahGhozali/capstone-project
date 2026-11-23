import "server-only";

import { prisma } from "@/libs/prisma";
import { requireRole } from "@/libs/dal";
import { StatusPengisian } from "./utils";
import { checkIsBagianComplete } from "./services";

export async function getAllKuesioner() {
  try {
    const kuesionerList = await prisma.kuesioner.findMany({
      select: {
        id: true,
        judul: true,
        deskripsi: true,
        periode: true,
        status: true,
        _count: {
          select: {
            respon: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return kuesionerList.map((kuesioner) => ({
      id: kuesioner.id,
      judul: kuesioner.judul,
      deskripsi: kuesioner.deskripsi,
      periode: kuesioner.periode,
      status: kuesioner.status,
      totalRespon: kuesioner._count.respon,
    }));
  } catch (error) {
    console.log("❌ Get All Kuesioner Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getKuesionerById(id: string) {
  try {
    const kuesioner = await prisma.kuesioner.findUnique({
      where: { id },
      select: {
        id: true,
        judul: true,
        deskripsi: true,
        periode: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            respon: true,
          },
        },
        bagian: {
          orderBy: { urutan: "asc" },
          select: {
            id: true,
            judul: true,
            urutan: true,
            pertanyaan: {
              orderBy: { urutan: "asc" },
              select: {
                id: true,
                teks: true,
                tipe: true,
                wajib: true,
                urutan: true,
              },
            },
          },
        },
      },
    });

    if (!kuesioner) return null;

    const { _count, ...data } = kuesioner;

    return { ...data, totalRespon: _count.respon };
  } catch (error) {
    console.log("❌ Get Kuesioner By ID Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getKuesionerListForMahasiswa() {
  const { userId: mahasiswaId } = await requireRole("Mahasiswa");

  try {
    const kuesionerList = await prisma.kuesioner.findMany({
      where: { status: { in: ["Aktif", "Ditutup"] } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        judul: true,
        deskripsi: true,
        periode: true,
        status: true,
        createdAt: true,
        respon: {
          take: 1,
          where: { mahasiswaId },
          select: { id: true, status: true, submittedAt: true },
        },
      },
    });

    return kuesionerList.map((kuesioner) => {
      const response = kuesioner.respon[0];

      const isKuesionerClosed = kuesioner.status === "Ditutup";
      const isResponseDraf = response?.status === "Draf";
      const isResponseCompleted = response?.status === "Selesai";
      const isResponseUncompleted = isKuesionerClosed && isResponseDraf;

      const statusPengisian = !response
        ? StatusPengisian.Belum
        : isResponseUncompleted
          ? StatusPengisian.TidakSelesai
          : isResponseCompleted
            ? StatusPengisian.Selesai
            : StatusPengisian.Proses;

      return {
        id: kuesioner.id,
        judul: kuesioner.judul,
        deskripsi: kuesioner.deskripsi,
        periode: kuesioner.periode,
        status: kuesioner.status,
        statusPengisian,
        tanggalSubmit: response?.submittedAt ?? null,
      };
    });
  } catch (error) {
    console.log("❌ Get Kuesioner List By Mahasiswa Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getKuesionerWizard(kuesionerId: string) {
  const { userId: mahasiswaId } = await requireRole("Mahasiswa");

  try {
    const [kuesioner, kuesionerResponse] = await Promise.all([
      prisma.kuesioner.findFirst({
        where: {
          id: kuesionerId,
          status: { in: ["Aktif", "Ditutup"] },
        },
        select: {
          id: true,
          judul: true,
          deskripsi: true,
          periode: true,
          status: true,
          bagian: {
            orderBy: { urutan: "asc" },
            select: {
              id: true,
              judul: true,
              urutan: true,
              pertanyaan: {
                orderBy: { urutan: "asc" },
                select: {
                  id: true,
                  teks: true,
                  tipe: true,
                  wajib: true,
                  urutan: true,
                },
              },
            },
          },
        },
      }),
      prisma.responKuesioner.findUnique({
        where: { kuesionerId_mahasiswaId: { kuesionerId, mahasiswaId } },
        select: {
          id: true,
          status: true,
          submittedAt: true,
          jawaban: {
            select: {
              pertanyaanId: true,
              nilai: true,
              jawabanTeks: true,
            },
          },
        },
      }),
    ]);

    if (!kuesioner) return null;

    const jawabanResponse = kuesionerResponse?.jawaban ?? [];

    const bagian = kuesioner.bagian.map((bagian) => {
      const pertanyaanIds = new Set(bagian.pertanyaan.map((pertanyaan) => pertanyaan.id));
      const jawaban = jawabanResponse.filter(({ pertanyaanId }) => pertanyaanIds.has(pertanyaanId));

      const isBagianComplete = checkIsBagianComplete(bagian.pertanyaan, jawaban);
      const statusBagian = isBagianComplete ? StatusPengisian.Selesai : StatusPengisian.TidakSelesai;

      return { ...bagian, statusBagian };
    });

    const uncompleteBagian = bagian.find((bagian) => bagian.statusBagian !== "Selesai");
    const lastBagianId = kuesioner.bagian.at(-1)?.id;

    const currentBagianId = uncompleteBagian?.id ?? lastBagianId ?? null;

    return {
      id: kuesioner.id,
      judul: kuesioner.judul,
      deskripsi: kuesioner.deskripsi,
      periode: kuesioner.periode,
      status: kuesioner.status,
      jawaban: jawabanResponse,
      tanggalSubmit: kuesionerResponse?.submittedAt ?? null,
      isComplete: kuesionerResponse?.status === "Selesai",
      currentBagianId,
      bagian,
    };
  } catch (error) {
    console.log("❌ Get Kuesioner Wizard Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getAllKuesionerRespondent(kuesionerId: string) {
  await requireRole("Kaprodi");

  try {
    const kuesioner = await prisma.kuesioner.findUnique({
      where: { id: kuesionerId },
      select: {
        judul: true,
        periode: true,
        respon: {
          where: { kuesionerId, status: "Selesai" },
          orderBy: [{ submittedAt: "asc" }, { id: "asc" }],
          select: {
            id: true,
            submittedAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!kuesioner) return null;

    return {
      judul: kuesioner.judul,
      periode: kuesioner.periode,
      respondent: kuesioner.respon.map((responden, index) => ({
        id: responden.id,
        nama: `Responden ${index + 1}`,
        tanggalSubmit: responden.submittedAt ?? responden.createdAt,
      })),
    };
  } catch (error) {
    console.log("❌ Get All Kuesioner Respondent Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getKuesionerRespondentExportData(kuesionerId: string) {
  await requireRole("Kaprodi");

  try {
    const kuesioner = await prisma.kuesioner.findUnique({
      where: { id: kuesionerId },
      select: {
        judul: true,
        periode: true,
        bagian: {
          orderBy: { urutan: "asc" },
          select: {
            pertanyaan: {
              orderBy: { urutan: "asc" },
              select: {
                id: true,
                teks: true,
                tipe: true,
              },
            },
          },
        },
        respon: {
          where: { status: "Selesai" },
          orderBy: [{ submittedAt: "asc" }, { id: "asc" }],
          select: {
            submittedAt: true,
            createdAt: true,
            jawaban: {
              select: {
                pertanyaanId: true,
                nilai: true,
                jawabanTeks: true,
              },
            },
          },
        },
      },
    });

    if (!kuesioner) return null;

    const pertanyaanList = kuesioner.bagian.flatMap((bagian) => bagian.pertanyaan);

    const columns = [
      { id: "namaResponden", header: "Nama Responden" },
      { id: "tanggalSubmit", header: "Tanggal Submit" },
      ...pertanyaanList.map((pertanyaan) => ({
        id: pertanyaan.id,
        header: pertanyaan.teks,
      })),
    ];

    const rows = kuesioner.respon.map((respon, index) => {
      const jawabanMap = new Map(respon.jawaban.map((jawaban) => [jawaban.pertanyaanId, jawaban]));

      const row: Record<string, string | number | Date | null> = {
        namaResponden: `Responden ${index + 1}`,
        tanggalSubmit: respon.submittedAt ?? respon.createdAt,
      };

      for (const pertanyaan of pertanyaanList) {
        const jawaban = jawabanMap.get(pertanyaan.id);
        row[pertanyaan.id] = jawaban == null ? null : pertanyaan.tipe === "Likert" ? jawaban.nilai : jawaban.jawabanTeks;
      }

      return row;
    });

    return {
      rows,
      columns,
      judul: kuesioner.judul,
      periode: kuesioner.periode,
    };
  } catch (error) {
    console.log("❌ Get Export Kuesioner Respondent Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}

export async function getResponKuesionerDetail(kuesionerId: string, responId: string) {
  await requireRole("Kaprodi");

  try {
    const [kuesioner, kuesionerResponse] = await Promise.all([
      prisma.kuesioner.findFirst({
        where: { id: kuesionerId, status: { in: ["Aktif", "Ditutup"] } },
        select: {
          bagian: {
            orderBy: { urutan: "asc" },
            select: {
              id: true,
              judul: true,
              urutan: true,
              pertanyaan: {
                orderBy: { urutan: "asc" },
                select: {
                  id: true,
                  teks: true,
                  tipe: true,
                  wajib: true,
                  urutan: true,
                },
              },
            },
          },
        },
      }),
      prisma.responKuesioner.findFirst({
        where: { id: responId, kuesionerId, status: "Selesai" },
        select: {
          submittedAt: true,
          jawaban: {
            select: {
              pertanyaanId: true,
              nilai: true,
              jawabanTeks: true,
            },
          },
        },
      }),
    ]);

    if (!kuesioner || !kuesionerResponse) return null;

    const jawabanResponse = kuesionerResponse.jawaban;

    const bagian = kuesioner.bagian.map((bagian) => {
      const pertanyaanIds = new Set(bagian.pertanyaan.map((pertanyaan) => pertanyaan.id));

      const jawaban = jawabanResponse.filter(({ pertanyaanId }) => pertanyaanIds.has(pertanyaanId));

      const statusBagian = checkIsBagianComplete(bagian.pertanyaan, jawaban) ? StatusPengisian.Selesai : StatusPengisian.TidakSelesai;

      return { ...bagian, statusBagian };
    });

    return {
      bagian,
      jawaban: jawabanResponse,
      tanggalSubmit: kuesionerResponse.submittedAt,
    };
  } catch (error) {
    console.log("❌ Get Respon Kuesioner Detail Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}
