import * as z from "zod";

export const KelasSchema = z.object({
  nama: z.string().min(1, "Nama kelas wajib diisi").max(20, "Nama kelas maksimal 20 karakter"),
  angkatan: z.coerce.number<number>("Tahun angkatan wajib diisi!").min(2000, "Tahun angkatan tidak valid!").max(2100, "Tahun angkatan tidak valid!"),
});

export type KelasInput = z.infer<typeof KelasSchema>;
