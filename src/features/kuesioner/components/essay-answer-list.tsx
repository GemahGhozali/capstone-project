import { IconMessageDots } from "@tabler/icons-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface EssayAnswerListProps {
  data: string[];
}

export function EssayAnswerList({ data }: EssayAnswerListProps) {
  if (data.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader className="max-w-none!">
          <EmptyMedia variant="icon">
            <IconMessageDots />
          </EmptyMedia>
          <EmptyTitle>Belum Ada Jawaban Apapun</EmptyTitle>
          <EmptyDescription>Semua jawaban esai dari pertanyaan akan ditampilkan disini</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((jawaban, index) => (
        <p key={index} className="rounded-lg border bg-muted/30 p-3 text-sm whitespace-pre-wrap break-words">
          {jawaban}
        </p>
      ))}
    </div>
  );
}
