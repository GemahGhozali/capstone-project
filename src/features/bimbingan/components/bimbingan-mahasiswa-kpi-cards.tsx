import { cn } from "cn";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBook, IconCircleCheck, IconCircleX, IconHourglass } from "@tabler/icons-react";

interface BimbinganMahasiswaKPICardsProps {
  data: {
    keseluruhan: number;
    menunggu: number;
    disetujui: number;
    ditolak: number;
  };
}

export function BimbinganMahasiswaKPICards({ data }: BimbinganMahasiswaKPICardsProps) {
  const cardIconBaseClass = "grid size-12 shrink-0 place-content-center rounded-full mb-3";
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <div className={cn(cardIconBaseClass, "bg-muted text-muted-foreground")}>
            <IconBook />
          </div>
          <CardTitle className="text-lg font-semibold">{data.keseluruhan} Total</CardTitle>
          <CardDescription>Bimbingan Keseluruhan</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <div className={cn(cardIconBaseClass, "bg-blue-500/15 text-blue-500")}>
            <IconHourglass />
          </div>
          <CardTitle className="text-lg font-semibold">{data.menunggu} Total</CardTitle>
          <CardDescription>Bimbingan Belum Direview</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <div className={cn(cardIconBaseClass, "bg-green-500/15 text-green-500")}>
            <IconCircleCheck />
          </div>
          <CardTitle className="text-lg font-semibold">{data.disetujui} Total</CardTitle>
          <CardDescription>Bimbingan Disetujui</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <div className={cn(cardIconBaseClass, "bg-red-500/15 text-red-500")}>
            <IconCircleX />
          </div>
          <CardTitle className="text-lg font-semibold">{data.ditolak} Total</CardTitle>
          <CardDescription>Bimbingan Ditolak</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
