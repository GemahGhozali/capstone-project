import type { getAllResume, getMahasiswaResumeManagementData } from "./queries";

export type ResumeListItem = Awaited<ReturnType<typeof getAllResume>>[number];
export type ResumeManagementData = Awaited<ReturnType<typeof getMahasiswaResumeManagementData>>["resume"];
