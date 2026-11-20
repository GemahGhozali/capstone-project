"use client";

import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { ReactTable } from "@tanstack/react-table";
import { DataTableFeatures } from "@/components/data/features";
import { BimbinganMahasiswa } from "../types";

interface BimbinganMahasiswaTableToolbarProps {
  table: ReactTable<DataTableFeatures, BimbinganMahasiswa>;
  onCreate: () => void;
}

export function BimbinganMahasiswaTableToolbar({ table, onCreate }: BimbinganMahasiswaTableToolbarProps) {
  return (
    <div className="flex gap-3 lg:items-end max-lg:flex-col">
      <div className="space-y-0.5">
        <h1 className="font-semibold text-lg">Catatan Bimbingan</h1>
        <p className="text-muted-foreground text-sm">Catat hasil bimbingan dan unggah bukti pendukung anda.</p>
      </div>
      <Button className="lg:ml-auto" onClick={onCreate}>
        Tambah Catatan
        <IconPlus data-icon="inline-end" />
      </Button>
    </div>
  );
}
