import * as z from "zod";
import { JawabanInput } from "./schemas";
import { StatusKuesioner } from "@/generated/prisma/enums";
import { BagianKuesionerWizard, JawabanKuesionerWizard } from "./types";

export const StatusPengisian = { Belum: "Belum Mengisi", Proses: "Sedang Mengisi", Selesai: "Selesai" } as const;

export const kuesionerStatusStyles: Record<StatusKuesioner, string> = {
  Draf: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-500",
  Aktif: "bg-green-500/15 text-green-600 dark:text-green-500",
  Ditutup: "bg-neutral-500/15 text-neutral-500",
};

export const LIKERT_OPTIONS = [
  { value: 1, label: "Kurang" },
  { value: 2, label: "Cukup" },
  { value: 3, label: "Cukup Baik" },
  { value: 4, label: "Baik" },
  { value: 5, label: "Baik Sekali" },
] as const;

export function generateFillKuesionerFormSchema(bagian: BagianKuesionerWizard) {
  const shape = bagian.pertanyaan.reduce<Record<string, z.ZodString>>((shape, pertanyaan) => {
    let field = z.string().trim();

    if (pertanyaan.tipe === "Esai") {
      field = field.max(1000, "Jawaban esai maksimal 1000 karakter!");
    }

    if (pertanyaan.wajib) {
      field = field.min(1, "Pertanyaan wajib untuk diisi!");
    }

    shape[pertanyaan.id] = field;
    return shape;
  }, {});

  return z.object(shape);
}

export function generateFillKuesionerFormValues(bagian: BagianKuesionerWizard, jawaban: JawabanKuesionerWizard[]) {
  const jawabanMap = new Map(jawaban.map((item) => [item.pertanyaanId, item]));

  return Object.fromEntries(
    bagian.pertanyaan.map((pertanyaan) => {
      const jawaban = jawabanMap.get(pertanyaan.id);
      const jawabanValue = jawaban ? String(jawaban.nilai ?? jawaban.jawabanTeks ?? "") : "";
      return [pertanyaan.id, jawabanValue];
    }),
  );
}

export function generateJawabanPayload(bagian: BagianKuesionerWizard, formValues: Record<string, string>): JawabanInput[] {
  return bagian.pertanyaan.flatMap((pertanyaan): JawabanInput[] => {
    const value = (formValues[pertanyaan.id] ?? "").trim();

    if (!value) return [];

    const jawabanEsaiPayload = [{ pertanyaanId: pertanyaan.id, nilai: null, jawabanTeks: value }];
    const jawabanLikertPayload = [{ pertanyaanId: pertanyaan.id, nilai: Number(value), jawabanTeks: null }];

    return pertanyaan.tipe === "Likert" ? jawabanLikertPayload : jawabanEsaiPayload;
  });
}
