import * as z from "zod";
import { KategoriCapstone, PeranAnggotaTim, StatusPersetujuan } from "@/generated/prisma/enums";

const TeamMemberSchema = z.object({
  id: z.uuid(),
  fotoProfil: z.string().nullable(),
  namaLengkap: z.string(),
  nim: z.string(),
  kategoriCapstone: z.enum(KategoriCapstone),
  peran: z.enum(PeranAnggotaTim),
  statusPersetujuan: z.enum(StatusPersetujuan),
});

export const TeamSchema = z.object({
  namaTim: z.string().min(1, "Nama tim wajib diisi!"),
  anggota: z
    .array(TeamMemberSchema)
    .min(2, "Tim minimal harus memiliki 2 anggota (Ketua + minimal 1 anggota).")
    .max(5, "Tim maksimal memiliki 5 anggota (Ketua + maksimal 4 anggota)."),
});

export type TeamInput = z.infer<typeof TeamSchema>;
export type TeamMemberInput = z.infer<typeof TeamMemberSchema>;
