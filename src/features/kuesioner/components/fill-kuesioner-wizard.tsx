"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@/components/ui/circular-progress";
import { FillKuesionerForm } from "./fill-kuesioner-form";
import { KuesionerWizard as KuesionerWizardData } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface KuesionerWizardProps {
  kuesioner: KuesionerWizardData;
}

export function KuesionerWizard({ kuesioner }: KuesionerWizardProps) {
  const router = useRouter();

  const [currentBagianId, setCurrentBagianId] = useState<string | null>(kuesioner.currentBagianId);

  const bagian = kuesioner.bagian;

  const firstBagian = bagian[0];
  const currentBagian = bagian.find((item) => item.id === currentBagianId) ?? firstBagian;
  const currentBagianIndex = bagian.indexOf(currentBagian);

  const prevBagian = currentBagianIndex > 0 ? bagian[currentBagianIndex - 1] : null;
  const nextBagian = currentBagianIndex !== -1 && currentBagianIndex < bagian.length - 1 ? bagian[currentBagianIndex + 1] : null;

  const progressPercentage = Math.round((currentBagianIndex / bagian.length) * 100);

  const moveBagian = (bagianId: string) => {
    router.refresh();
    setCurrentBagianId(bagianId);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">{kuesioner.judul}</h1>
        <p className="text-muted-foreground text-sm">{kuesioner.deskripsi ?? "Tidak ada deskripsi tercantum."}</p>
      </div>
      <Card className="p-0 gap-0 divide-y">
        <CardHeader className="p-6 flex items-center justify-between gap-4 max-sm:flex-col max-sm:text-center">
          <div className="space-y-1 max-sm:order-2">
            <CardTitle>{currentBagian.judul}</CardTitle>
            <CardDescription>
              Bagian {currentBagianIndex + 1} dari {bagian.length}
            </CardDescription>
          </div>
          <div className="relative">
            <CircularProgress max={100} value={progressPercentage} className="size-12 max-sm:size-20 shrink-0 max-sm:order-1 [&>div]:hidden" />
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium max-sm:text-base">{progressPercentage}%</p>
          </div>
        </CardHeader>
      </Card>
      <Card className="p-0 gap-0 max-sm:mb-22">
        <CardContent className="p-0">
          <FillKuesionerForm
            key={currentBagian.id}
            kuesionerId={kuesioner.id}
            bagian={currentBagian}
            jawaban={kuesioner.jawaban}
            prevBagianId={prevBagian?.id}
            nextBagianId={nextBagian?.id}
            onMoveBagian={moveBagian}
          />
        </CardContent>
      </Card>
    </div>
  );
}
