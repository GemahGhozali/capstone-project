import { ResumeTable } from "@/features/resume/components/resume-table";
import { getAllResume } from "@/features/resume/queries";

export default async function ResumeMasukPage() {
  const resume = await getAllResume();

  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Resume Masuk</h1>
        <p className="text-muted-foreground text-sm">Daftar mahasiswa yang mengajukan resume.</p>
      </div>
      <ResumeTable data={resume} viewer="Dosen" />
    </div>
  );
}
