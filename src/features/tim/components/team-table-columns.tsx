"use client";

import Link from "next/link";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconEye } from "@tabler/icons-react";
import { TeamListItem } from "../types";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";
import { ArchiveTeamButton } from "./archive-team-button";
import { teamCompletenessStatusStyles, teamStatusStyles } from "../utils";

const columnHelper = createColumnHelper<DataTableFeatures, TeamListItem>();

export function teamTableColumns() {
  return columnHelper.columns([
    columnHelper.accessor((row) => row.nama, {
      id: "search",
      filterFn: "includesString",
    }),

    columnHelper.accessor("nama", {
      header: "Nama Tim",
    }),

    columnHelper.accessor("jumlahAnggota", {
      header: "Jumlah Anggota",
    }),

    columnHelper.accessor("statusKelengkapan", {
      id: "statusKelengkapan",
      header: "Status Kelengkapan",
      filterFn: "arrHas",
      cell: ({ getValue }) => {
        const status = getValue();
        return <Badge className={cn(teamCompletenessStatusStyles[status])}>{status}</Badge>;
      },
    }),

    columnHelper.accessor("status", {
      id: "status",
      header: "Status",
      filterFn: "arrHas",
      cell: ({ getValue }) => {
        const status = getValue();
        return <Badge className={cn(teamStatusStyles[status])}>{status}</Badge>;
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link href={`/kaprodi/daftar-tim/${row.original.id}/detail`}>
            <Button variant="outline" size="icon-sm" aria-label="Lihat detail tim">
              <IconEye stroke={1.75} />
            </Button>
          </Link>
          <ArchiveTeamButton id={row.original.id} status={row.original.status} />
        </div>
      ),
    }),
  ]);
}
