"use client";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { KuesionerDetail } from "../types";
import { KuesionerFormDialog } from "./kuesioner-form-dialog";
import { kuesionerStatusStyles } from "../utils";
import { ChangeStatusAlertDialog } from "./change-status-alert-dialog";
import { IconCloudUpload, IconEdit, IconLock } from "@tabler/icons-react";

interface KuesionerHeaderProps {
  kuesioner: NonNullable<KuesionerDetail>;
}

export type KuesionerHeaderDialogAction = { action: "edit-kuesioner" } | { action: "change-status"; mode: "publish" | "close" };

export function KuesionerHeader({ kuesioner }: KuesionerHeaderProps) {
  const [dialog, setDialog] = useState<KuesionerHeaderDialogAction | undefined>(undefined);

  const handleCloseDialog = () => setDialog(undefined);

  const isDrafStatus = kuesioner.status === "Draf";
  const isAktifStatus = kuesioner.status === "Aktif";

  const openKuesionerFormDialog = dialog?.action === "edit-kuesioner";
  const statusChange = dialog?.action === "change-status" ? { kuesioner, mode: dialog.mode } : undefined;

  return (
    <>
      <header className="flex lg:items-end justify-between gap-3 max-lg:flex-col">
        <div className="space-y-0.5">
          <Badge className={cn("mb-2.5", kuesionerStatusStyles[kuesioner.status])}>Status Kuesioner - {kuesioner.status}</Badge>
          <h1 className="font-semibold text-lg">
            {kuesioner.judul} - Periode {kuesioner.periode}
          </h1>
          <p className="text-muted-foreground text-sm">{kuesioner.deskripsi ?? "Tidak ada deskripsi tertulis."}</p>
        </div>
        {isDrafStatus && (
          <div className="flex gap-3 max-lg:*:grow max-sm:flex-col">
            <Button variant="outline" onClick={() => setDialog({ action: "edit-kuesioner" })}>
              <IconEdit data-icon="inline-start" />
              Edit Kuesioner
            </Button>
            <Button onClick={() => setDialog({ action: "change-status", mode: "publish" })}>
              <IconCloudUpload data-icon="inline-start" />
              Publish
            </Button>
          </div>
        )}
        {isAktifStatus && (
          <Button variant="outline" onClick={() => setDialog({ action: "change-status", mode: "close" })}>
            <IconLock data-icon="inline-start" />
            Tutup Kuesioner
          </Button>
        )}
      </header>
      <KuesionerFormDialog kuesioner={kuesioner} open={openKuesionerFormDialog} closeDialog={handleCloseDialog} />
      <ChangeStatusAlertDialog statusChange={statusChange} closeDialog={handleCloseDialog} />
    </>
  );
}
