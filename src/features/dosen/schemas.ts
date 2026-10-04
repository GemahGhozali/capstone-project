import * as z from "zod";
import { StatusDosen, StatusDosenPembimbingDetail } from "@/generated/prisma/enums";

const DosenImageSchema = z
  .file()
  .max(1024 * 1024, "Maksimal ukuran foto profil adalah 1 MB!")
  .mime(["image/jpeg", "image/jpg", "image/png", "image/webp"], "Foto profil hanya menerima format JPG, JPEG, PNG atau WEBP!");

export const CreateDosenSchema = z.object({
  alamatEmail: z.email("Format email tidak valid!"),
  password: z.string().min(8, "Password wajib diisi dan minimal 8 karakter!"),
  nip: z.string().min(1, "NIP dosen wajib diisi!"),
  namaLengkap: z.string().min(1, "Nama lengkap dosen wajib diisi!"),
  bidangKeahlian: z.string().min(1, "Bidang keahlian dosen wajib diisi!"),
  fotoProfil: z.union([DosenImageSchema, z.string(), z.null()]),
  status: z.enum(StatusDosen, "Status keaktifan dosen wajib dipilih!"),
  prodiId: z.uuid("Prodi wajib dipilih!"),
  roleId: z.array(z.uuid("Role tidak valid!")).min(1, "Role wajib dipilih satu!"),
  statusBimbingan: z.enum(StatusDosenPembimbingDetail).default("Buka"),
  kuotaBimbingan: z.coerce.number<number>("Kuota bimbingan wajib diisi!").positive("Batas bimbingan minimal 1!").default(10),
});

export const UpdateDosenSchema = CreateDosenSchema.extend({
  password: z.string().min(8, "Password minimal 8 karakter!").or(z.literal("")),
});

export type CreateDosenInput = z.infer<typeof CreateDosenSchema>;
export type UpdateDosenInput = z.infer<typeof UpdateDosenSchema>;
export type DosenInput = CreateDosenInput | UpdateDosenInput;
