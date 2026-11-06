import { getAllKuesioner } from "./queries";
import { getKuesionerById } from "./queries";

export type KuesionerOverview = Awaited<ReturnType<typeof getAllKuesioner>>[number];
export type KuesionerDetail = Awaited<ReturnType<typeof getKuesionerById>>;
export type BagianKuesioner = NonNullable<KuesionerDetail>["bagian"][number];
export type PertanyaanKuesioner = NonNullable<KuesionerDetail>["bagian"][number]["pertanyaan"][number];
