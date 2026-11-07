"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { KuesionerHeader } from "./kuesioner-header";
import { BagianFormDialog } from "./bagian-kuesioner-form-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { BagianKuesionerCard } from "./bagian-kuesioner-card";
import { DeleteBagianAlertDialog } from "./delete-bagian-alert-dialog";
import { DeletePertanyaanAlertDialog } from "./delete-pertanyaan-alert-dialog";
import { PertanyaanKuesionerFormDialog } from "./pertanyaan-kuesioner-form-dialog";
import { IconListDetails, IconLock, IconPlus } from "@tabler/icons-react";
import { BagianKuesioner, KuesionerDetail, PertanyaanKuesioner } from "../types";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Callout, CalloutContent, CalloutDescription, CalloutIcon, CalloutTitle } from "@/components/ui/callout";

interface KuesionerBuilderProps {
  kuesioner: NonNullable<KuesionerDetail>;
}

export type KuesionerBuilderDialogAction =
  | { action: "create-bagian" }
  | { action: "update-bagian"; bagian: BagianKuesioner }
  | { action: "delete-bagian"; bagian: BagianKuesioner }
  | { action: "create-pertanyaan"; bagianId: string }
  | { action: "update-pertanyaan"; bagianId: string; pertanyaan: PertanyaanKuesioner }
  | { action: "delete-pertanyaan"; pertanyaan: PertanyaanKuesioner };

export function KuesionerBuilder({ kuesioner }: KuesionerBuilderProps) {
  const [dialog, setDialog] = useState<KuesionerBuilderDialogAction | undefined>(undefined);

  const handleCloseDialog = () => setDialog(undefined);

  const openBagianForm = dialog?.action === "create-bagian" || dialog?.action === "update-bagian";
  const bagianToDelete = dialog?.action === "delete-bagian" ? dialog.bagian : undefined;
  const bagianToEdit = dialog?.action === "update-bagian" ? dialog.bagian : undefined;

  const openPertanyaanForm = dialog?.action === "create-pertanyaan" || dialog?.action === "update-pertanyaan";
  const pertanyaanToDelete = dialog?.action === "delete-pertanyaan" ? dialog.pertanyaan : undefined;
  const pertanyaanToEdit = openPertanyaanForm && dialog ? { bagianId: dialog.bagianId, pertanyaan: "pertanyaan" in dialog ? dialog.pertanyaan : undefined } : undefined;

  const isDrafStatus = kuesioner.status === "Draf";

  return (
    <div className="space-y-6">
      <KuesionerHeader kuesioner={kuesioner} />
      {!isDrafStatus && (
        <Callout>
          <CalloutIcon>
            <IconLock />
          </CalloutIcon>
          <CalloutContent>
            <CalloutTitle>Struktur Kuesioner Terkunci!</CalloutTitle>
            <CalloutDescription>
              {kuesioner.status === "Aktif"
                ? "Kuesioner sudah dipublish! Perubahan hanya bisa dilakukan saat kuesioner berstatus Draf."
                : "Kuesioner sudah ditutup! Struktur kuesioner sudah bersifat final dan tidak bisa diubah lagi."}
            </CalloutDescription>
          </CalloutContent>
        </Callout>
      )}
      {kuesioner.bagian.length === 0 ? (
        <Card>
          <CardContent>
            <Empty className="border border-dashed">
              <EmptyHeader className="max-w-none">
                <EmptyMedia variant="icon">
                  <IconListDetails />
                </EmptyMedia>
                <EmptyTitle>Tidak Ada Bagian Kuesioner</EmptyTitle>
                <EmptyDescription>Mulai bangun struktur kuesioner dengan menambahkan bagian pertama</EmptyDescription>
              </EmptyHeader>
              {isDrafStatus && (
                <Button onClick={() => setDialog({ action: "create-bagian" })}>
                  Tambah Bagian
                  <IconPlus data-icon="inline-emd" />
                </Button>
              )}
            </Empty>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {kuesioner.bagian.map((bagian, index) => (
            <BagianKuesionerCard
              key={bagian.id}
              bagian={bagian}
              nomor={index + 1}
              isEditable={isDrafStatus}
              onEditBagian={(bagian) => setDialog({ action: "update-bagian", bagian })}
              onDeleteBagian={(bagian) => setDialog({ action: "delete-bagian", bagian })}
              onCreatePertanyaan={(bagian) => setDialog({ action: "create-pertanyaan", bagianId: bagian.id })}
              onEditPertanyaan={(bagian, pertanyaan) => setDialog({ action: "update-pertanyaan", bagianId: bagian.id, pertanyaan })}
              onDeletePertanyaan={(pertanyaan) => setDialog({ action: "delete-pertanyaan", pertanyaan })}
            />
          ))}
          {isDrafStatus && (
            <Button onClick={() => setDialog({ action: "create-bagian" })} className="w-full">
              Tambah Bagian
              <IconPlus data-icon="inline-end" />
            </Button>
          )}
        </div>
      )}
      <BagianFormDialog kuesionerId={kuesioner.id} bagian={bagianToEdit} open={openBagianForm} closeDialog={handleCloseDialog} />
      <DeleteBagianAlertDialog bagianToDelete={bagianToDelete} closeDialog={handleCloseDialog} />
      <PertanyaanKuesionerFormDialog bagianId={pertanyaanToEdit?.bagianId ?? ""} pertanyaan={pertanyaanToEdit?.pertanyaan} open={openPertanyaanForm} closeDialog={handleCloseDialog} />
      <DeletePertanyaanAlertDialog pertanyaanToDelete={pertanyaanToDelete} closeDialog={handleCloseDialog} />
    </div>
  );
}
