import * as z from "zod";

const TanggalSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid!");

const JamSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format jam tidak valid!");

function isNotPastDate(tanggal: string) {
  const now = new Date();
  const endOfTanggal = new Date(`${tanggal}T23:59:59.999`);
  return endOfTanggal.getTime() >= now.getTime();
}

export const CreateJadwalBimbinganSchema = z
  .object({
    tanggal: TanggalSchema,
    jamMulai: JamSchema,
    jamTutup: JamSchema,
    kuota: z.number().int("Kuota harus berupa bilangan bulat!").min(1, "Kuota minimal 1!"),
  })
  .refine((data) => data.jamMulai < data.jamTutup, {
    error: "Jam tutup harus setelah jam mulai!",
    path: ["jamTutup"],
  })
  .refine((data) => isNotPastDate(data.tanggal), {
    error: "Tanggal tidak boleh lampau!",
    path: ["tanggal"],
  });

export const BookingJadwalSchema = z.object({
  jadwalId: z.uuid("Jadwal wajib dipilih!"),
  catatanMahasiswa: z.string().min(1, "Catatan mahasiswa wajib diisi!"),
});

export const CancelBookingSchema = z.object({
  alasanPembatalan: z.string().min(1, "Alasan pembatalan wajib diisi!"),
});

export type CreateJadwalBimbinganInput = z.infer<typeof CreateJadwalBimbinganSchema>;
export type BookingJadwalInput = z.infer<typeof BookingJadwalSchema>;
export type CancelBookingInput = z.infer<typeof CancelBookingSchema>;
