import * as z from "zod";
import { StatusMahasiswa } from "@/generated/prisma/enums";

const MahasiswaImageSchema = z
  .file()
  .max(1024 * 1024, "Maksimal ukuran foto profil adalah 1 MB!")
  .mime(["image/jpeg", "image/jpg", "image/png", "image/webp"], "Foto profil hanya menerima format JPG, JPEG, PNG atau WEBP!");

const ImportMahasiswaFileSchema = z
  .file("File Excel wajib diupload!")
  .max(5 * 1024 * 1024, "Maksimal ukuran file Excel adalah 5 MB!")
  .refine((file) => file.name.toLowerCase().endsWith(".xlsx"), "File harus berformat XLSX!");

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

export const BulkUpdateStatusMahasiswaSchema = z.object({
  ids: z.array(z.uuid("ID mahasiswa tidak valid!")).min(1, "Pilih minimal satu mahasiswa!"),
  status: z.enum(StatusMahasiswa, "Status keaktifan mahasiswa wajib dipilih!"),
});

export const BulkDeleteMahasiswaSchema = z.object({
  ids: z.array(z.uuid("ID mahasiswa tidak valid!")).min(1, "Pilih minimal satu mahasiswa!"),
});

export const ImportMahasiswaSchema = z.object({
  file: ImportMahasiswaFileSchema,
  defaultPassword: z.string().min(8, "Default password wajib diisi dan minimal 8 karakter!"),
});

export const ImportMahasiswaRowSchema = z.object({
  nim: z.string().trim().min(1, "NIM wajib diisi!"),
  namaLengkap: z.string().trim().min(1, "Nama lengkap wajib diisi!"),
  kodeKelas: z.string().trim().min(1, "Kode kelas wajib diisi!"),
  tanggalMasuk: z.date("Tanggal masuk tidak valid!"),
});

export type CreateMahasiswaInput = z.infer<typeof CreateMahasiswaSchema>;
export type UpdateMahasiswaInput = z.infer<typeof UpdateMahasiswaSchema>;
export type MahasiswaInput = CreateMahasiswaInput | UpdateMahasiswaInput;
export type BulkUpdateStatusMahasiswaInput = z.infer<typeof BulkUpdateStatusMahasiswaSchema>;
export type BulkDeleteMahasiswaInput = z.infer<typeof BulkDeleteMahasiswaSchema>;

export type ImportMahasiswaInput = z.infer<typeof ImportMahasiswaSchema>;
export type ImportMahasiswaRowInput = z.infer<typeof ImportMahasiswaRowSchema>;
