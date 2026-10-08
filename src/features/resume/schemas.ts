import * as z from "zod";

const ResumeFileSchema = z
  .file()
  .max(5 * 1024 * 1024, "Maksimal ukuran file resume adalah 5 MB!")
  .mime(["application/pdf"], "File resume harus berformat PDF!");

export const ResumeSchema = z.object({
  subjudul: z.string().min(1, "Subjudul proposal wajib diisi!"),
  dosenId: z.uuid("Dosen pembimbing wajib dipilih!"),
  file: z.union([ResumeFileSchema, z.string()]),
});

export const ReviewResumeSchema = z.object({
  status: z.enum(["Disetujui", "Ditolak"], "Status resume wajib dipilih!"),
  catatan: z.string().min(1, "Catatan review wajib diisi!"),
});

export type ResumeInput = z.infer<typeof ResumeSchema>;
export type ReviewResumeInput = z.infer<typeof ReviewResumeSchema>;
