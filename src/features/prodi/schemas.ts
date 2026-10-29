import * as z from "zod";

export const ProdiSchema = z.object({
  nama: z.string().min(1, "Nama prodi wajib diisi"),
});

export type ProdiInput = z.infer<typeof ProdiSchema>;
