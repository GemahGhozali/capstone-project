import { getAllDosen, getDosenById } from "./queries";

export type DosenDetails = Awaited<ReturnType<typeof getDosenById>>;
export type DosenOverview = Awaited<ReturnType<typeof getAllDosen>>[number];
