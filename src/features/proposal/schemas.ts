import * as z from "zod";

const ProposalFileSchema = z
  .file("File proposal wajib diupload!")
  .max(5 * 1024 * 1024, "Maksimal ukuran file proposal adalah 5 MB!")
  .mime(["application/pdf"], "File proposal harus berformat PDF!");

export const SubmitProposalSchema = z.object({
  judul: z.string().min(1, "Judul proposal wajib diisi!"),
  mitra: z.string().min(1, "Nama mitra wajib diisi!"),
  file: ProposalFileSchema,
});

export const UpdateProposalSchema = SubmitProposalSchema.extend({
  file: z.union([ProposalFileSchema, z.string()], "File proposal wajib diupload!"),
});

export const ReviewProposalSchema = z.object({
  status: z.enum(["Disetujui", "Ditolak", "Revisi"], "Status proposal wajib dipilih!"),
  catatan: z.string().min(1, "Catatan review wajib diisi!"),
});

export type ReviewProposalInput = z.infer<typeof ReviewProposalSchema>;
export type SubmitProposalInput = z.infer<typeof SubmitProposalSchema>;
export type UpdateProposalInput = z.infer<typeof UpdateProposalSchema>;
export type ProposalInput = SubmitProposalInput | UpdateProposalInput;
