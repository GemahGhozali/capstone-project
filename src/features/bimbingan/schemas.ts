import * as z from "zod";
import { isNotPastDate, isNotPastTime } from "./utils";

const TanggalSchema = z.iso.date("Format tanggal tidak valid!");

const JamSchema = z.iso.time("Format jam tidak valid!");

export const CreateJadwalBimbinganSchema = z
  .object({
    tanggal: TanggalSchema,
    jamMulai: JamSchema,
    jamTutup: JamSchema,
    kuota: z.coerce.number<number>("Kuota wajib diisi!").int("Kuota harus berupa bilangan bulat!").min(1, "Kuota minimal 1!"),
  })
  .refine((data) => data.jamMulai < data.jamTutup, {
    error: "Jam tutup harus setelah jam mulai!",
    path: ["jamTutup"],
  })
  .refine((data) => isNotPastDate(data.tanggal), {
    error: "Tanggal tidak boleh lampau!",
    path: ["tanggal"],
  })
  .refine((data) => isNotPastTime(data.tanggal, data.jamMulai), {
    error: "Jam mulai tidak boleh di masa lampau!",
    path: ["jamMulai"],
  });

export const BookingJadwalSchema = z.object({
  catatanMahasiswa: z.string().min(1, "Catatan mahasiswa wajib diisi!"),
});

export const CancelBookingSchema = z.object({
  alasanPembatalan: z.string().min(1, "Alasan pembatalan wajib diisi!"),
});

export const CompleteBookingSchema = z.object({
  catatanDosen: z.string().min(1, "Catatan dosen wajib diisi!"),
});

export type CreateJadwalBimbinganInput = z.infer<typeof CreateJadwalBimbinganSchema>;
export type BookingJadwalInput = z.infer<typeof BookingJadwalSchema>;
export type CancelBookingInput = z.infer<typeof CancelBookingSchema>;
export type CompleteBookingInput = z.infer<typeof CompleteBookingSchema>;
