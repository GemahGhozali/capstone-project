import {
  getJadwalBimbinganDosen,
  getJadwalBimbinganById,
  getJadwalBimbinganMahasiswa,
  getBookingBimbinganDosen,
  getBookingBimbinganMahasiswa,
} from "./queries";

export type JadwalBimbinganDetail = NonNullable<Awaited<ReturnType<typeof getJadwalBimbinganById>>>;

export type JadwalBimbinganDosen = Awaited<ReturnType<typeof getJadwalBimbinganDosen>>[number];
export type BookingBimbinganDosen = Awaited<ReturnType<typeof getBookingBimbinganDosen>>[number];

export type JadwalBimbinganMahasiswa = Awaited<ReturnType<typeof getJadwalBimbinganMahasiswa>>[number];
export type BookingBimbinganMahasiswa = Awaited<ReturnType<typeof getBookingBimbinganMahasiswa>>[number];
