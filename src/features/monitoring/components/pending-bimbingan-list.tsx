import Link from "next/link";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { bimbinganStatusStyles } from "@/features/bimbingan/utils";
import { VerifyBimbinganButton } from "@/features/bimbingan/components/verifiy-bimbingan-button";
import { DosenPembimbingDashboard } from "../types";
import { IconFileDescription, IconFolderOpen } from "@tabler/icons-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface PendingBimbinganListProps {
  data: DosenPembimbingDashboard;
}

export function PendingBimbinganList({ data }: PendingBimbinganListProps) {
  return (
    <Card>
      <CardHeader className="flex lg:items-end justify-between flex-col lg:flex-row gap-3">
        <div className="space-y-1">
          <CardTitle>Bimbingan Menunggu Review</CardTitle>
          <CardDescription>Catatan bimbingan terbaru yang perlu anda review</CardDescription>
        </div>
        <Link href="/dosen-pembimbing/bimbingan-mahasiswa" className="max-lg:w-full">
          <Button className="max-lg:w-full">Lihat Semua Bimbingan</Button>
        </Link>
      </CardHeader>
      <CardContent className="gap-6">
        {data.bimbinganMenunggu.length === 0 ? (
          <Empty className="border">
            <EmptyHeader className="max-w-none!">
              <EmptyMedia variant="icon">
                <IconFolderOpen />
              </EmptyMedia>
              <EmptyTitle>Tidak Ada Bimbingan Yang Perlu Direview</EmptyTitle>
              <EmptyDescription>Belum ada bimbingan yang perlu ditinjau saat ini.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Accordion className="gap-6" multiple>
            {data.bimbinganMenunggu.map((bimbingan) => (
              <AccordionItem key={bimbingan.id} value={bimbingan.id} className="border rounded-lg divide-y">
                <AccordionTrigger className="p-4 gap-3 items-end hover:no-underline">
                  <div className="space-y-1 min-w-0">
                    <Badge className={cn(bimbinganStatusStyles[bimbingan.status], "mb-3")}>{bimbingan.status}</Badge>
                    <p className="line-clamp-1 text-base font-medium">{bimbingan.mahasiswa}</p>
                    <p className="line-clamp-1 text-muted-foreground font-normal">
                      {format(bimbingan.tanggal, "eeee, d MMMM yyyy", { locale: localeId })}
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <div className="p-4">
                    <p className="whitespace-pre-line text-foreground">{bimbingan.catatan}</p>
                  </div>
                  <div className="p-4 border-t flex justify-end gap-3 max-sm:flex-col">
                    <Link href={bimbingan.filePath} target="_blank">
                      <Button variant="outline" size="sm" className="max-sm:w-full">
                        <IconFileDescription data-icon="inline-start" />
                        Lihat Bukti
                      </Button>
                    </Link>
                    <VerifyBimbinganButton id={bimbingan.id} status={bimbingan.status} showLabel />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
