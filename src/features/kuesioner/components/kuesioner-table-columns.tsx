"use client";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KuesionerOverview } from "../types";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";
import { kuesionerStatusStyles } from "../utils";
import { IconCloudUpload, IconCopy, IconDotsVertical, IconEdit, IconListDetails, IconLock, IconTrash } from "@tabler/icons-react";

const columnHelper = createColumnHelper<DataTableFeatures, KuesionerOverview>();

export interface KuesionerTableActions {
  onEdit: (kuesioner: KuesionerOverview) => void;
  onDelete: (kuesioner: KuesionerOverview) => void;
  onDuplicate: (kuesioner: KuesionerOverview) => void;
  onChangeStatus: (kuesioner: KuesionerOverview, mode: "publish" | "close") => void;
}

export function kuesionerTableColumns({ onEdit, onDelete, onDuplicate, onChangeStatus }: KuesionerTableActions) {
  return columnHelper.columns([
    columnHelper.accessor((row) => `${row.judul} ${row.deskripsi ?? ""} ${row.periode}`, {
      id: "search",
      enableHiding: false,
      filterFn: "includesString",
    }),

    columnHelper.accessor("judul", {
      header: "Judul Kuesioner",
      cell: ({ row, getValue }) => (
        <div className="space-y-0.5">
          <p className="font-medium">{getValue()}</p>
          <p className="text-muted-foreground text-sm line-clamp-1">{row.original.deskripsi ?? "Tanpa deskripsi"}</p>
        </div>
      ),
    }),

    columnHelper.accessor("periode", {
      header: "Periode",
    }),

    columnHelper.accessor("totalRespon", {
      header: "Total Respon",
      cell: ({ getValue }) => {
        const totalRespon = getValue();

        return <span>{totalRespon} Respon</span>;
      },
    }),

    columnHelper.accessor("status", {
      header: "Status",
      filterFn: "equalsString",
      cell: ({ getValue }) => {
        const status = getValue();

        return <Badge className={cn(kuesionerStatusStyles[status])}>{status}</Badge>;
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const kuesioner = row.original;

        const isDraf = kuesioner.status === "Draf";
        const isAktif = kuesioner.status === "Aktif";
        const canChangeStatus = isDraf || isAktif;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Menu aksi" />}>
              <IconDotsVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {canChangeStatus && (
                <>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Ubah Status</DropdownMenuLabel>
                    {isDraf && (
                      <DropdownMenuItem onClick={() => onChangeStatus(kuesioner, "publish")}>
                        <IconCloudUpload />
                        Publish Kuesioner
                      </DropdownMenuItem>
                    )}
                    {isAktif && (
                      <DropdownMenuItem onClick={() => onChangeStatus(kuesioner, "close")}>
                        <IconLock />
                        Tutup Kuesioner
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuGroup>
                <DropdownMenuLabel>Aksi Lainnya</DropdownMenuLabel>
                <DropdownMenuItem render={<Link href={`/kaprodi/daftar-kuesioner/${kuesioner.id}/edit`} />}>
                  <IconListDetails />
                  Kelola Kuesioner
                </DropdownMenuItem>
                {isDraf && (
                  <DropdownMenuItem onClick={() => onEdit(kuesioner)}>
                    <IconEdit />
                    Edit Kuesioner
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onDuplicate(kuesioner)}>
                  <IconCopy />
                  Duplikat Kuesioner
                </DropdownMenuItem>
                {isDraf && (
                  <DropdownMenuItem variant="destructive" onClick={() => onDelete(kuesioner)}>
                    <IconTrash />
                    Hapus Kuesioner
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ]);
}
