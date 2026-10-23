import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { ProposalManagementData } from "../types";
import { ProposalReviewAccordion } from "./proposal-review-accordion";
import { IconMessageDots, IconPlus } from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface ProposalReviewsProps {
  reviews: NonNullable<ProposalManagementData>["reviews"];
  viewer: "Mahasiswa" | "Dosen";
}

export function ProposalReviews({ reviews, viewer }: ProposalReviewsProps) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="pt-6 flex gap-3 max-sm:flex-col sm:justify-between sm:items-end">
        <div className="space-y-1">
          <CardTitle>Riwayat Review Proposal</CardTitle>
          <CardDescription>Riwayat review dan status proposal tim {viewer === "Mahasiswa" && "anda"}</CardDescription>
        </div>
        {viewer === "Dosen" && (
          <Button className="max-sm:w-full">
            Beri Review <IconPlus data-icon="inline-end" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-6">
        {reviews.length > 0 ? (
          <Accordion className="gap-6" defaultValue={[reviews[0].id]} multiple>
            {reviews.map((review) => (
              <ProposalReviewAccordion key={review.id} review={review} />
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
