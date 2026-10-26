import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ResumeForm } from "@/features/resume/components/resume-form";
import { ResumeReviews } from "@/features/resume/components/resume-reviews";
import { IconInfoCircle } from "@tabler/icons-react";
import { ResumeOverview } from "@/features/resume/components/resume-overview";
import { ResumeStatusCallout } from "@/features/resume/components/resume-status-callout";
import { getAllDosenPembimbing } from "@/features/dosen/queries";
import { getMahasiswaResumeManagementData } from "@/features/resume/queries";
import { Callout, CalloutIcon, CalloutContent, CalloutTitle, CalloutDescription, CalloutAction } from "@/components/ui/callout";

export default async function UploadResumePage() {
  const [resumeManagementData, dosenPembimbingList] = await Promise.all([getMahasiswaResumeManagementData(), getAllDosenPembimbing()]);

  const { proposal, resume } = resumeManagementData;

  if (!proposal) {
    return (
      <Callout>
        <CalloutIcon className="bg-blue-500/15 text-blue-500">
          <IconInfoCircle />
        </CalloutIcon>
        <CalloutContent>
          <CalloutTitle>Tim Anda Belum Upload Proposal!</CalloutTitle>
          <CalloutDescription>Silahkan upload proposal tim anda terlebih dahulu.</CalloutDescription>
        </CalloutContent>
        <CalloutAction
          render={
            <Link href="/mahasiswa/upload-proposal" className="w-full">
              <Button className="w-full">Upload Proposal</Button>
            </Link>
          }
        />
      </Callout>
    );
  }

  const proposalNotApprovedYet = proposal.status !== "Disetujui";

  if (proposalNotApprovedYet) {
    return (
      <Callout>
        <CalloutIcon className="bg-blue-500/15 text-blue-500">
          <IconInfoCircle />
        </CalloutIcon>
        <CalloutContent>
          <CalloutTitle>Anda Belum Bisa Upload Proposal!</CalloutTitle>
          <CalloutDescription>Proposal tim anda belum disetujui oleh dosen Capstone Project.</CalloutDescription>
        </CalloutContent>
      </Callout>
    );
  }

  if (!resume) {
    return <ResumeForm resume={resume} dosenPembimbingList={dosenPembimbingList} />;
  }

  const showOverview = resume.status === "Disetujui";

  return (
    <div className="space-y-6">
      <ResumeStatusCallout viewer="Mahasiswa" resumeStatus={resume.status} dosenPembimbing={resume.dosen.namaLengkap} />
      <ResumeReviews viewer="Mahasiswa" currentResumeStatus={resume.status} reviews={resume.reviews} />
      {showOverview ? <ResumeOverview resume={resume} /> : <ResumeForm resume={resume} dosenPembimbingList={dosenPembimbingList} />}
    </div>
  );
}
