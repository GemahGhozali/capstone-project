import { Accordion } from "@/components/ui/accordion";
import { StatusProposal } from "@/generated/prisma/enums";
import { IconMessageDots } from "@tabler/icons-react";
import { ReviewProposalForm } from "./review-proposal-form";
import { ProposalManagementData } from "../types";
import { ProposalReviewAccordion } from "./proposal-review-accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface ProposalReviewsProps {
  viewer: "Mahasiswa" | "Dosen";
  currentProposalStatus: StatusProposal;
  reviews: NonNullable<ProposalManagementData>["reviews"];
}

export function ProposalReviews({ reviews, viewer, currentProposalStatus }: ProposalReviewsProps) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="pt-6 flex gap-3 max-sm:flex-col sm:justify-between sm:items-end">
        <div className="space-y-1">
          <CardTitle>Riwayat Review Proposal</CardTitle>
          <CardDescription>Daftar catatan dan status evaluasi proposal.</CardDescription>
        </div>
        {viewer === "Dosen" && <ReviewProposalForm currentProposalStatus={currentProposalStatus} />}
      </CardHeader>
      <CardContent className="p-6">
        {reviews.length > 0 ? (
          <Accordion className="gap-6" key={reviews[0].id} defaultValue={[reviews[0].id]} multiple>
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
