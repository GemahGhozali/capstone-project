"use client";

import Link from "next/link";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { IconEye } from "@tabler/icons-react";
import { id as localeId } from "date-fns/locale";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";
import { proposalStatusStyles } from "../utils";
import { ArchiveProposalButton } from "./archive-proposal-button";
import { ProposalListItem, ProposalViewer } from "../types";

const columnHelper = createColumnHelper<DataTableFeatures, ProposalListItem>();

export function proposalTableColumns({ basePath, viewer }: { basePath: string; viewer: ProposalViewer }) {
  return columnHelper.columns([
    columnHelper.accessor((row) => `${row.namaTim} ${row.judul} ${row.mitra}`, {
      id: "search",
      filterFn: "includesString",
    }),

    columnHelper.accessor("namaTim", {
      header: "Nama Tim",
    }),

    columnHelper.accessor("mitra", {
      header: "Mitra",
      cell: ({ getValue }) => <span className="block min-w-48 whitespace-normal">{getValue()}</span>,
    }),

    columnHelper.accessor("judul", {
      header: "Judul",
      cell: ({ getValue }) => <span className="block min-w-48 whitespace-normal">{getValue()}</span>,
    }),

    columnHelper.accessor("tanggalPengajuan", {
      header: "Tanggal Pengajuan",
      cell: ({ getValue }) => format(getValue(), "eeee, dd MMMM yyyy", { locale: localeId }),
    }),

    columnHelper.accessor("status", {
      header: "Status",
      filterFn: "arrHas",
      cell: ({ getValue }) => {
        const status = getValue();
        return <Badge className={cn(proposalStatusStyles[status])}>{status}</Badge>;
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link href={`${basePath}/${row.original.id}/detail`}>
            <Button variant="outline" size="icon-sm">
              <IconEye />
            </Button>
          </Link>
          {viewer === "Kaprodi" && <ArchiveProposalButton id={row.original.id} status={row.original.status} />}
        </div>
      ),
    }),
  ]);
}
