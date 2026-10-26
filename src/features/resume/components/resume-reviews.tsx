import { Accordion } from "@/components/ui/accordion";
import { StatusResume } from "@/generated/prisma/enums";
import { IconMessageDots } from "@tabler/icons-react";
import { ResumeManagementData } from "../types";
import { ReviewResumeForm } from "./review-resume-form";
import { ResumeReviewAccordion } from "./resume-review-accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface ResumeReviewsProps {
  viewer: "Mahasiswa" | "Dosen";
  currentResumeStatus: StatusResume;
  reviews: NonNullable<ResumeManagementData>["reviews"];
}

export function ResumeReviews({ reviews, viewer, currentResumeStatus }: ResumeReviewsProps) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="pt-6 flex gap-3 max-sm:flex-col sm:justify-between sm:items-end">
        <div className="space-y-1">
          <CardTitle>Riwayat Review Resume</CardTitle>
          <CardDescription>Daftar catatan dan status evaluasi resume.</CardDescription>
        </div>
        {viewer === "Dosen" && <ReviewResumeForm currentResumeStatus={currentResumeStatus} />}
      </CardHeader>
      <CardContent className="p-6">
        {reviews.length > 0 ? (
          <Accordion className="gap-6" key={reviews[0].id} defaultValue={[reviews[0].id]} multiple>
            {reviews.map((review) => (
              <ResumeReviewAccordion key={review.id} review={review} />
            ))}
          </Accordion>
        ) : (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconMessageDots />
              </EmptyMedia>
              <EmptyTitle>Belum Ada Review Apapun</EmptyTitle>
              <EmptyDescription>Semua review dari dosen akan ditampilkan disini.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  );
}
