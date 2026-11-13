import { getJadwalBimbinganDosen } from "./queries";

export type JadwalBimbinganDosen = Awaited<ReturnType<typeof getJadwalBimbinganDosen>>[number];
