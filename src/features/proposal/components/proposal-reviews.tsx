"use client";

import { Accordion } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconMessageDots } from "@tabler/icons-react";
import type { ProposalManagementData } from "../types";
import { ProposalReviewAccordion } from "./proposal-review-accordion";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface ProposalReviewsProps {
  reviews: NonNullable<ProposalManagementData>["reviews"];
}

export function ProposalReviews({ reviews }: ProposalReviewsProps) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="pt-6">
        <CardTitle>Riwayat Review Proposal</CardTitle>
        <CardDescription>List riwayat review dan status proposal tim anda</CardDescription>
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
