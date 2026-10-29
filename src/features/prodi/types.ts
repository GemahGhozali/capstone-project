import { getAllProdi } from "./queries";

export type ProdiOverview = Awaited<ReturnType<typeof getAllProdi>>[number];
