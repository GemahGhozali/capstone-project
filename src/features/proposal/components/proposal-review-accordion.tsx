import { cn } from "cn";
import { id } from "date-fns/locale";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { generateNameInitials } from "@/utils/generate-name-initials";
import { ProposalManagementData } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ProposalReviewAccordionProps {
  review: NonNullable<ProposalManagementData>["reviews"][number];
}

const reviewStatusStyles = {
  Menunggu: "bg-blue-500/15 text-blue-500",
  Disetujui: "bg-green-500/15 text-green-500",
  Ditolak: "bg-red-500/15 text-red-500",
  Revisi: "bg-yellow-500/15 text-yellow-500",
} as const;

export function ProposalReviewAccordion({ review }: ProposalReviewAccordionProps) {
  return (
    <AccordionItem value={review.id} className="border rounded-lg divide-y">
      <AccordionTrigger className="items-end sm:items-center hover:no-underline p-4 gap-3 relative">
        <div className="flex gap-3 flex-col sm:flex-row">
          <Avatar>
            <AvatarImage src={review.dosen.fotoProfil ?? ""} alt={review.dosen.namaLengkap} />
            <AvatarFallback>{generateNameInitials(review.dosen.namaLengkap)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className="line-clamp-1 text-sm font-medium">{review.dosen.namaLengkap}</p>
            <p className="line-clamp-1 text-xs text-muted-foreground font-normal max-sm:hidden">
              {format(review.tanggal, "eeee, d MMMM yyyy, HH:mm", { locale: id })}
            </p>
            <p className="line-clamp-1 text-xs text-muted-foreground font-normal sm:hidden">
              {format(review.tanggal, "eee, d MMM yyyy, HH:mm", { locale: id })}
            </p>
          </div>
        </div>
        <Badge className={cn("h-6 ml-auto max-sm:absolute max-sm:top-4 max-sm:right-4", reviewStatusStyles[review.status])}>{review.status}</Badge>
      </AccordionTrigger>
      <AccordionContent className="p-4">
        <p className="whitespace-pre-line text-muted-foreground">{review.catatan}</p>
      </AccordionContent>
    </AccordionItem>
  );
}
