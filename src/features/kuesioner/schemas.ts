import * as z from "zod";

export const KuesionerSchema = z.object({
  judul: z.string().trim().min(1, "Judul kuesioner wajib diisi!").max(255, "Judul kuesioner maksimal 255 karakter!"),
  periode: z.string().trim().min(1, "Periode wajib diisi!").max(50, "Periode maksimal 50 karakter!"),
  deskripsi: z.string().trim().max(1000, "Deskripsi maksimal 1000 karakter!").optional(),
});

export const BagianSchema = z.object({
  judul: z.string().trim().min(1, "Judul bagian wajib diisi!").max(255, "Judul bagian maksimal 255 karakter!"),
});

export const PertanyaanSchema = z.object({
  teks: z.string().trim().min(1, "Teks pertanyaan wajib diisi!").max(1000, "Teks pertanyaan maksimal 1000 karakter!"),
  tipe: z.enum(["Likert", "Esai"], "Tipe pertanyaan wajib dipilih!"),
  wajib: z.boolean().optional(),
});

export const JawabanSchema = z.object({
  pertanyaanId: z.uuid("Pertanyaan tidak valid!"),
  nilai: z.number().int().min(1, "Pilihan jawaban wajib dipilih!").max(5, "Pilihan jawaban tidak valid!").nullable(),
  jawabanTeks: z.string().trim().max(1000, "Jawaban esai maksimal 1000 karakter!").nullable(),
});

export const BagianJawabanSchema = z.object({
  bagianId: z.uuid("Bagian tidak valid!"),
  jawaban: z.array(JawabanSchema),
});

export const JawabanLikertSchema = z.object({
  pertanyaanId: z.uuid(),
  nilai: z.number().int().min(1).max(5),
  jawabanTeks: z.null().optional(),
});

export const JawabanEsaiSchema = z.object({
  pertanyaanId: z.uuid(),
  nilai: z.null().optional(),
  jawabanTeks: z.string().trim().min(1),
});

export type KuesionerInput = z.infer<typeof KuesionerSchema>;
export type BagianInput = z.infer<typeof BagianSchema>;
export type PertanyaanInput = z.infer<typeof PertanyaanSchema>;
export type JawabanInput = z.infer<typeof JawabanSchema>;
export type BagianJawabanInput = z.infer<typeof BagianJawabanSchema>;
