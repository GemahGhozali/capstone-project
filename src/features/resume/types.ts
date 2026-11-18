import type { getAllResume, getMahasiswaResumeManagementData, getResumeById } from "./queries";

export type ResumeListItem = Awaited<ReturnType<typeof getAllResume>>[number];
export type ResumeDetail = Awaited<ReturnType<typeof getResumeById>>;
export type ResumeManagementData = Awaited<ReturnType<typeof getMahasiswaResumeManagementData>>["resume"];
export type ResumeViewer = "Mahasiswa" | "Dosen" | "Kaprodi";
