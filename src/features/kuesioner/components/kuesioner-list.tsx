import Link from "next/link";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IconEye, IconNut } from "@tabler/icons-react";
import { KuesionerMahasiswa } from "../types";
import { kuesionerStatusStyles } from "../utils";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const statusPengisianStyles: Record<KuesionerMahasiswa["statusPengisian"], string> = {
  "Belum Mengisi": "bg-neutral-500/15 text-neutral-500",
  "Sedang Mengisi": "bg-yellow-500/15 text-yellow-500",
  Selesai: "bg-green-500/15 text-green-500",
  "Tidak Selesai": "bg-red-500/15 text-red-500",
};

interface KuesionerListProps {
  kuesionerList: KuesionerMahasiswa[];
}

export function KuesionerList({ kuesionerList }: KuesionerListProps) {
  return (
    <div className="space-y-6">
      {kuesionerList.map((kuesioner) => {
        const isKuesionerClosed = kuesioner.status === "Ditutup";
        const isResponseCompleted = kuesioner.statusPengisian === "Selesai";
        const isResponseOnProgress = kuesioner.statusPengisian === "Sedang Mengisi";

        const isKuesionerLocked = isKuesionerClosed || isResponseCompleted;

        return (
          <Card key={kuesioner.id}>
            <CardHeader className="flex gap-4 flex-col lg:flex-row lg:justify-between lg:items-end">
              <div className="space-y-1">
                <Badge className={cn(kuesionerStatusStyles[kuesioner.status], "mb-2.5")}>{kuesioner.status}</Badge>
                <CardTitle>{kuesioner.judul}</CardTitle>
                <CardDescription>{kuesioner.deskripsi ?? "Tidak ada deskripsi tercantum."}</CardDescription>
              </div>
              <Link href={`/mahasiswa/pengisian-kuesioner/${kuesioner.id}`} className="max-lg:w-full">
                <Button variant={isKuesionerLocked ? "outline" : "default"} size="sm" className="max-lg:w-full">
                  {isKuesionerLocked && <IconEye data-icon="inline-start" />}
                  {isKuesionerLocked ? "Lihat Tanggapan" : isResponseOnProgress ? "Lanjutkan Pengisian" : "Mulai Pengisian"}
                </Button>
              </Link>
            </CardHeader>
            <Separator />
            <CardFooter className="flex justify-between">
              <p className="text-sm flex items-center gap-1.5 text-muted-foreground">
                <IconNut size={16} />
                Pengisian :
              </p>
              <Badge className={cn(statusPengisianStyles[kuesioner.statusPengisian])}>{kuesioner.statusPengisian}</Badge>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
