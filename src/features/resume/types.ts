import { getMahasiswaResumeManagementData } from "./queries";

export type ResumeManagementData = Awaited<ReturnType<typeof getMahasiswaResumeManagementData>>["resume"];
