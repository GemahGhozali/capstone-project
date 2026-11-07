"use client";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IconEdit } from "@tabler/icons-react";
import { KuesionerDetail } from "../types";
import { KuesionerFormDialog } from "./kuesioner-form-dialog";
import { kuesionerStatusStyles } from "../utils";

interface KuesionerHeaderProps {
  kuesioner: NonNullable<KuesionerDetail>;
}

export function KuesionerHeader({ kuesioner }: KuesionerHeaderProps) {
  const isDrafStatus = kuesioner.status === "Draf";

  const [openKuesionerFormDialog, setOpenKuesionerFormDialog] = useState<boolean>(false);

  const handleOpenKuesionerFormDialog = () => setOpenKuesionerFormDialog(true);
  const handleCloseKuesionerFormDialog = () => setOpenKuesionerFormDialog(false);

  return (
    <>
      <header className="flex md:items-end justify-between gap-3 max-md:flex-col">
        <div className="space-y-0.5">
          <Badge className={cn("mb-2.5", kuesionerStatusStyles[kuesioner.status])}>Status Kuesioner - {kuesioner.status}</Badge>
          <h1 className="font-semibold text-lg">
            {kuesioner.judul} - Periode {kuesioner.periode}
          </h1>
          <p className="text-muted-foreground text-sm">{kuesioner.deskripsi ?? "Tidak ada deskripsi tertulis."}</p>
        </div>
        {isDrafStatus && (
          <Button variant="outline" disabled={!isDrafStatus} onClick={handleOpenKuesionerFormDialog}>
            <IconEdit data-icon="inline-start" />
            Edit Kuesioner
          </Button>
        )}
      </header>
      <KuesionerFormDialog kuesioner={kuesioner} open={openKuesionerFormDialog} closeDialog={handleCloseKuesionerFormDialog} />
    </>
  );
}
