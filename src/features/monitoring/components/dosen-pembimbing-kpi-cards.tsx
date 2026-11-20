import { cn } from "cn";
import { DosenPembimbingDashboard } from "../types";
import { IconBook, IconFileDescription, IconUsers } from "@tabler/icons-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DosenPembimbingKPICardsProps {
  data: DosenPembimbingDashboard;
}

export function DosenPembimbingKPICards({ data }: DosenPembimbingKPICardsProps) {
  const cardIconBaseClass = "grid size-12 shrink-0 place-content-center rounded-full mb-3";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <div className={cn(cardIconBaseClass, "bg-green-500/15 text-green-500")}>
            <IconUsers />
          </div>
          <CardTitle className="text-lg font-semibold">{data.totalMahasiswaDisetujui} Total</CardTitle>
          <CardDescription>Mahasiswa Bimbingan</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <div className={cn(cardIconBaseClass, "bg-blue-500/15 text-blue-500")}>
            <IconFileDescription />
          </div>
          <CardTitle className="text-lg font-semibold">{data.totalResumeMenunggu} Total</CardTitle>
          <CardDescription>Resume Perlu Direview</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <div className={cn(cardIconBaseClass, "bg-yellow-500/15 text-yellow-500")}>
            <IconBook />
          </div>
          <CardTitle className="text-lg font-semibold">{data.totalBimbinganMenunggu} Total</CardTitle>
          <CardDescription>Bimbingan Perlu Direview</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
