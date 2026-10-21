import { Accordion } from "@/components/ui/accordion";
import { IconMessageDots } from "@tabler/icons-react";
import { ResumeManagementData } from "../types";
import { ResumeReviewAccordion } from "./resume-review-accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface ResumeReviewsProps {
  reviews: NonNullable<ResumeManagementData>["reviews"];
}

export function ResumeReviews({ reviews }: ResumeReviewsProps) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="pt-6">
        <CardTitle>Riwayat Review Resume</CardTitle>
        <CardDescription>List riwayat review dan status resume anda</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {reviews.length > 0 ? (
          <Accordion className="gap-6" defaultValue={[reviews[0].id]} multiple>
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
