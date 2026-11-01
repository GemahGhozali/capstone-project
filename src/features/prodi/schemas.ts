import * as z from "zod";

export const ProdiSchema = z.object({
  nama: z.string().min(1, "Nama prodi wajib diisi"),
  kode: z.string().min(1, "Kode prodi wajib diisi").max(20, "Kode prodi maksimal 20 karakter"),
});

export type ProdiInput = z.infer<typeof ProdiSchema>;
