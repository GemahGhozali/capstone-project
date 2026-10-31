import { notFound } from "next/navigation";
import { getResumeById } from "@/features/resume/queries";
import { ResumeReviews } from "@/features/resume/components/resume-reviews";
import { ResumeOverview } from "@/features/resume/components/resume-overview";
import { ResumeStatusCallout } from "@/features/resume/components/resume-status-callout";

type ResumeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ResumeDetailPage({ params }: ResumeDetailPageProps) {
  const { id } = await params;

  const resume = await getResumeById(id);

  if (!resume) notFound();

  return (
    <div className="space-y-6">
      <ResumeStatusCallout viewer="Kaprodi" dosenPembimbing={resume.dosen.namaLengkap} resumeStatus={resume.status} />
      <ResumeReviews viewer="Kaprodi" currentResumeStatus={resume.status} reviews={resume.reviews} />
      <ResumeOverview resume={resume} />
    </div>
  );
}
