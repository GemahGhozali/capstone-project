"use client";

import { IconFolderOpen } from "@tabler/icons-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export function RespondentTableEmptyState() {
  return (
    <Empty>
      <EmptyHeader className="max-w-none">
        <EmptyMedia variant="icon">
          <IconFolderOpen />
        </EmptyMedia>
        <EmptyTitle>Belum Ada Responden</EmptyTitle>
        <EmptyDescription>Semua responden dari kuesioner akan ditampilkan disini</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
