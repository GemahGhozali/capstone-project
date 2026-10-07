import * as z from "zod";
import { StatusMahasiswa } from "@/generated/prisma/enums";

const MahasiswaImageSchema = z
  .file()
  .max(1024 * 1024, "Maksimal ukuran foto profil adalah 1 MB!")
  .mime(["image/jpeg", "image/jpg", "image/png", "image/webp"], "Foto profil hanya menerima format JPG, JPEG, PNG atau WEBP!");

export const CreateMahasiswaSchema = z.object({
  fotoProfil: z.union([MahasiswaImageSchema, z.string(), z.null()]),
  namaLengkap: z.string().min(1, "Nama lengkap mahasiswa wajib diisi!"),
  nim: z.string().min(1, "NIM mahasiswa wajib diisi!"),
  kelasId: z.uuid("Kelas wajib dipilih!"),
  tanggalMasuk: z.date("Tanggal masuk wajib diisi!"),
  status: z.enum(StatusMahasiswa, "Status keaktifan mahasiswa wajib dipilih!"),
  alamatEmail: z.email("Format email tidak valid!"),
  password: z.string().min(8, "Password wajib diisi dan minimal 8 karakter!"),
});

export const UpdateMahasiswaSchema = CreateMahasiswaSchema.extend({
  password: z.string().min(8, "Password minimal 8 karakter!").or(z.literal("")),
});

export type CreateMahasiswaInput = z.infer<typeof CreateMahasiswaSchema>;
export type UpdateMahasiswaInput = z.infer<typeof UpdateMahasiswaSchema>;
export type MahasiswaInput = CreateMahasiswaInput | UpdateMahasiswaInput;
