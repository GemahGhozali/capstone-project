import * as z from "zod";

const ResumeFileSchema = z
  .file("File resume wajib diupload!")
  .max(5 * 1024 * 1024, "Maksimal ukuran file resume adalah 5 MB!")
  .mime(["application/pdf"], "File resume harus berformat PDF!");

export const SubmitResumeSchema = z.object({
  subjudul: z.string().min(1, "Subjudul resume wajib diisi!"),
  dosenId: z.uuid("Dosen pembimbing wajib dipilih!"),
  file: ResumeFileSchema,
});

export const UpdateResumeSchema = SubmitResumeSchema.extend({
  file: z.union([ResumeFileSchema, z.string()], "File resume wajib diupload!"),
});

export const ReviewResumeSchema = z.object({
  status: z.enum(["Disetujui", "Ditolak"], "Status resume wajib dipilih!"),
  catatan: z.string().min(1, "Catatan review wajib diisi!"),
});

export type SubmitResumeInput = z.infer<typeof SubmitResumeSchema>;
export type UpdateResumeInput = z.infer<typeof UpdateResumeSchema>;
export type ReviewResumeInput = z.infer<typeof ReviewResumeSchema>;
export type ResumeInput = SubmitResumeInput | UpdateResumeInput;
