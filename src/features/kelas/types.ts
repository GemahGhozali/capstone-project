import { getAllKelas } from "./queries";

export type KelasOverview = Awaited<ReturnType<typeof getAllKelas>>[number];
