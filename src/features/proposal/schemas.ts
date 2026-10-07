import * as z from "zod";
import { StatusProposal } from "@/generated/prisma/enums";

const ProposalFileSchema = z
  .file()
  .max(5 * 1024 * 1024, "Maksimal ukuran file proposal adalah 5 MB!")
  .mime(["application/pdf"], "File proposal harus berformat PDF!");

export const ProposalSchema = z.object({
  judul: z.string().min(1, "Judul proposal wajib diisi!"),
  mitra: z.string().min(1, "Nama mitra wajib diisi!"),
  file: z.union([ProposalFileSchema, z.string()]),
});

export const ReviewProposalSchema = z.object({
  status: z.enum(StatusProposal, "Status proposal wajib dipilih!"),
  catatan: z.string().min(1, "Catatan review wajib diisi!"),
});

export type ProposalInput = z.infer<typeof ProposalSchema>;
export type ReviewProposalInput = z.infer<typeof ReviewProposalSchema>;
