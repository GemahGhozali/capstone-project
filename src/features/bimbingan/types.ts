import { getJadwalBimbinganDosen } from "./queries";

export type JadwalBimbinganItem = Awaited<ReturnType<typeof getJadwalBimbinganDosen>>[number];
