import * as z from "zod";

const BimbinganFileSchema = z
  .file("Bukti pendukung wajib diupload!")
  .max(5 * 1024 * 1024, "Maksimal ukuran bukti pendukung adalah 5 MB!")
  .mime(["application/pdf", "image/jpeg", "image/png", "image/webp"], "Bukti pendukung harus berupa PDF atau gambar!");

export const CreateBimbinganSchema = z.object({
  tanggal: z.date("Tanggal bimbingan wajib diisi!"),
  catatan: z.string().min(1, "Catatan bimbingan wajib diisi!"),
  file: BimbinganFileSchema,
});

export const UpdateBimbinganSchema = CreateBimbinganSchema.extend({
  file: z.union([BimbinganFileSchema, z.string()], "Bukti pendukung wajib diupload!"),
});

export type CreateBimbinganInput = z.infer<typeof CreateBimbinganSchema>;
export type UpdateBimbinganInput = z.infer<typeof UpdateBimbinganSchema>;
export type BimbinganInput = CreateBimbinganInput | UpdateBimbinganInput;
