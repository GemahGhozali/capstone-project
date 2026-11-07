"use client";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BagianKuesioner, PertanyaanKuesioner } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { IconAlignCenter, IconCircleCheck, IconCircleMinus, IconEdit, IconListDetails, IconMessage, IconPlus, IconTopologyBus, IconTrash } from "@tabler/icons-react";

interface BagianKuesionerCardProps {
  bagian: BagianKuesioner;
  nomor: number;
  isEditable: boolean;
  onEditBagian: (bagian: BagianKuesioner) => void;
  onDeleteBagian: (bagian: BagianKuesioner) => void;
  onCreatePertanyaan: (bagian: BagianKuesioner) => void;
  onEditPertanyaan: (bagian: BagianKuesioner, pertanyaan: PertanyaanKuesioner) => void;
  onDeletePertanyaan: (pertanyaan: PertanyaanKuesioner) => void;
}

export function BagianKuesionerCard({ bagian, nomor, isEditable, onEditBagian, onDeleteBagian, onCreatePertanyaan, onEditPertanyaan, onDeletePertanyaan }: BagianKuesionerCardProps) {
  const renderPertanyaan = () => {
    if (bagian.pertanyaan.length === 0) {
      return (
        <Empty className="border border-dashed">
          <EmptyHeader className="max-w-none">
            <EmptyMedia variant="icon">
              <IconMessage />
            </EmptyMedia>
            <EmptyTitle>Belum Ada Pertanyaan</EmptyTitle>
            <EmptyDescription>Bagian kuesioner harus memiliki minimal satu pertanyaan</EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    }

    return bagian.pertanyaan.map((pertanyaan, index) => {
      const questionTypeLabel = pertanyaan.tipe === "Likert" ? "Skala Likert" : "Jawaban Esai";
      const questionTypeIcon = pertanyaan.tipe === "Likert" ? <IconTopologyBus size={20} stroke={1.5} className="rotate-180" /> : <IconAlignCenter size={16} />;

      const questionRequirementLabel = pertanyaan.wajib ? "Wajib Diisi" : "Opsional";
      const questionRequirementIcon = pertanyaan.wajib ? <IconCircleCheck size={16} /> : <IconCircleMinus size={16} />;

      return (
        <Card key={pertanyaan.id}>
          <CardHeader className="gap-2">
            <CardDescription className="flex items-center gap-2 font-medium">
              <div className="size-6 grid place-content-center bg-sidebar-primary/15 text-sidebar-primary rounded-full">
                <IconMessage size={14} />
              </div>
              Pertanyaan {index + 1}
            </CardDescription>
            <CardTitle>{pertanyaan.teks}</CardTitle>
            <div className={cn("flex flex-wrap gap-3", !isEditable ? "flex" : "lg:hidden")}>
              <div className="text-muted-foreground flex items-center gap-1">
                {questionTypeIcon} {questionTypeLabel}
              </div>
              <div className="text-muted-foreground flex items-center gap-1">
                {questionRequirementIcon} {questionRequirementLabel}
              </div>
            </div>
          </CardHeader>
          {isEditable && (
            <>
              <Separator />
              <CardContent className="flex-row lg:justify-between">
                <div className="flex flex-wrap gap-3 max-lg:hidden">
                  <div className="text-muted-foreground flex items-center gap-1">
                    {questionTypeIcon} {questionTypeLabel}
                  </div>
                  <div className="text-muted-foreground flex items-center gap-1">
                    {questionRequirementIcon} {questionRequirementLabel}
                  </div>
                </div>
                <div className="flex gap-3 max-lg:w-full max-lg:*:grow max-sm:flex-col">
                  <Button variant="outline" size="sm" onClick={() => onEditPertanyaan(bagian, pertanyaan)}>
                    <IconEdit stroke={1.75} data-icon="inline-start" />
                    Edit Pertanyaan
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDeletePertanyaan(pertanyaan)}>
                    <IconTrash stroke={1.75} data-icon="inline-start" />
                    Hapus Pertanyaan
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      );
    });
  };

  return (
    <Card>
      <CardHeader className="flex gap-4 lg:items-end max-lg:flex-col">
        <div className="space-y-1.5">
          <CardDescription className="flex items-center gap-2 font-medium">
            <div className="size-6 grid place-content-center bg-sidebar-primary/15 text-sidebar-primary rounded-full">
              <IconListDetails size={14} />
            </div>
            Bagian {nomor}
          </CardDescription>
          <CardTitle>{bagian.judul}</CardTitle>
        </div>
        {isEditable && (
          <div className="flex gap-3 lg:ml-auto max-lg:w-full max-lg:*:grow max-sm:flex-col">
            <Button variant="outline" size="sm" onClick={() => onEditBagian(bagian)}>
              <IconEdit stroke={1.75} data-icon="inline-start" />
              Edit Bagian
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDeleteBagian(bagian)}>
              <IconTrash stroke={1.75} data-icon="inline-start" />
              Hapus Bagian
            </Button>
          </div>
        )}
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4">
        {renderPertanyaan()}
        {isEditable && (
          <Button variant="outline" onClick={() => onCreatePertanyaan(bagian)}>
            Tambah Pertanyaan
            <IconPlus data-icon="inline-end" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
