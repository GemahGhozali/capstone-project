import * as z from "zod";

const NilaiSchema = z.coerce
  .number<number>("Nilai wajib diisi!")
  .int("Nilai harus berupa angka bulat!")
  .min(0, "Nilai minimal 0!")
  .max(100, "Nilai maksimal 100!");

const ImportPenilaianFileSchema = z
  .file("File Excel wajib diupload!")
  .max(5 * 1024 * 1024, "Maksimal ukuran file Excel adalah 5 MB!")
  .refine((file) => file.name.toLowerCase().endsWith(".xlsx"), "File harus berformat XLSX!");

export const PenilaianSchema = z.object({
  mahasiswaId: z.uuid("Mahasiswa tidak valid!"),
  nilai: NilaiSchema,
});

export const ImportPenilaianSchema = z.object({
  file: ImportPenilaianFileSchema,
});

export const ImportPenilaianRowSchema = z.object({
  nim: z.string().trim().min(1, "NIM wajib diisi!"),
  nilai: NilaiSchema,
});

export type PenilaianInput = z.infer<typeof PenilaianSchema>;
export type ImportPenilaianInput = z.infer<typeof ImportPenilaianSchema>;
export type ImportPenilaianRowInput = z.infer<typeof ImportPenilaianRowSchema>;
