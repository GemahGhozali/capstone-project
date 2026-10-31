"use client";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";
import { resumeStatusStyles } from "@/features/resume/utils";
import { proposalStatusStyles } from "@/features/proposal/utils";
import { CapstoneProjectMonitoring } from "../types";
import { StatusProposal, StatusResume } from "@/generated/prisma/enums";
import { IconClipboardText, IconDotsVertical, IconFileDescription, IconUser, IconUsers } from "@tabler/icons-react";

const columnHelper = createColumnHelper<DataTableFeatures, CapstoneProjectMonitoring>();

const neutralBadge = "bg-neutral-500/15 text-neutral-500";

export function capstoneProjectMonitoringTableColumns() {
  return columnHelper.columns([
    columnHelper.accessor((row) => `${row.namaLengkap} ${row.nim}`, {
      id: "search",
      enableHiding: false,
      filterFn: "includesString",
    }),

    columnHelper.accessor("namaLengkap", {
      id: "mahasiswa",
      header: "Mahasiswa",
      enableHiding: false,
      cell: ({ row, getValue }) => (
        <div className="space-y-0.5">
          <p className="font-medium">{getValue()}</p>
          <p className="text-muted-foreground">{row.original.nim}</p>
        </div>
      ),
    }),

    columnHelper.accessor("kelas.nama", {
      header: "Kelas",
    }),

    columnHelper.accessor("kelas.angkatan", {
      header: "Angkatan",
    }),

    columnHelper.accessor((row) => (row.tim ? "Terdaftar" : "Tidak Terdaftar"), {
      id: "statusTim",
      header: "Status Tim",
      filterFn: "equalsString",
      cell: ({ getValue }) => {
        const status = getValue();

        return <Badge className={cn(status === "Terdaftar" ? "bg-green-500/15 text-green-500" : neutralBadge)}>{status}</Badge>;
      },
    }),

    columnHelper.accessor((row) => row.proposal?.status ?? "Belum Upload", {
      id: "statusProposal",
      header: "Status Proposal",
      filterFn: "equalsString",
      cell: ({ getValue }) => {
        const status = getValue();

        return <Badge className={cn(status === "Belum Upload" ? neutralBadge : proposalStatusStyles[status as StatusProposal])}>{status}</Badge>;
      },
    }),

    columnHelper.accessor((row) => row.resume?.status ?? "Belum Upload", {
      id: "statusResume",
      header: "Status Resume",
      filterFn: "equalsString",
      cell: ({ getValue }) => {
        const status = getValue();

        return <Badge className={cn(status === "Belum Upload" ? neutralBadge : resumeStatusStyles[status as StatusResume])}>{status}</Badge>;
      },
    }),

    columnHelper.accessor("dosenPembimbing", {
      header: "Dosen Pembimbing",
      cell: ({ getValue }) => (getValue() ? <span>{getValue()}</span> : <Badge className={neutralBadge}>Belum Ada</Badge>),
    }),

    columnHelper.display({
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const { id, tim, proposal, resume } = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Menu aksi" />}>
              <IconDotsVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-fit">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem render={<Link href={`/kaprodi/daftar-mahasiswa/${id}/progress`} />}>
                  <IconUser />
                  Detail Mahasiswa
                </DropdownMenuItem>
                {tim && (
                  <DropdownMenuItem render={<Link href={`/kaprodi/daftar-tim/${tim.id}/detail`} />}>
                    <IconUsers />
                    Detail Tim
                  </DropdownMenuItem>
                )}
                {proposal && (
                  <DropdownMenuItem render={<Link href={`/kaprodi/daftar-proposal/${proposal.id}/detail`} />}>
                    <IconClipboardText />
                    Detail Proposal
                  </DropdownMenuItem>
                )}
                {resume && (
                  <DropdownMenuItem render={<Link href={`/kaprodi/daftar-resume/${resume.id}/detail`} />}>
                    <IconFileDescription />
                    Detail Resume
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
