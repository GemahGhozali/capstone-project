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
      isComplete: kuesionerResponse?.status === "Selesai",
      bagian,
      currentBagianId,
    };
  } catch (error) {
    console.log("❌ Get Kuesioner Wizard Error :", error);
    throw new Error("Terjadi kesalahan pada server!");
  }
}
