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
import { DataColumnSort } from "@/components/data/data-column-sort";
import { DataColumnFilter } from "@/components/data/data-column-filter";
import { DataTableFeatures } from "@/components/data/features";
import { createColumnHelper } from "@tanstack/react-table";
import { resumeStatusStyles } from "@/features/resume/utils";
import { proposalStatusStyles } from "@/features/proposal/utils";
import { CapstoneProjectMonitoring } from "../types";
import { StatusProposal, StatusResume } from "@/generated/prisma/enums";
import { IconClipboardText, IconDotsVertical, IconFileDescription, IconUser, IconUsers } from "@tabler/icons-react";

const columnHelper = createColumnHelper<DataTableFeatures, CapstoneProjectMonitoring>();

const neutralBadge = "bg-neutral-500/15 text-neutral-500";

const StatusTimOptions = ["Terdaftar", "Tidak Terdaftar"];
const StatusProposalOptions = ["Belum Upload", ...Object.keys(StatusProposal)];
const StatusResumeOptions = ["Belum Upload", ...Object.keys(StatusResume)];

export function capstoneProjectMonitoringTableColumns(data: CapstoneProjectMonitoring[]) {
  // Value kelas unique dari semua data
  const kelasOptions = [...new Set(data.map((row) => row.kelas.nama))].sort();

  // Value angkatan unique dari semua data
  const angkatanOptions = [...new Set(data.map((row) => String(row.kelas.angkatan)))].sort();

  // Value dosenPembimbing unique dari semua data
  const dosenPembimbingOptions = [...new Set(data.map((row) => row.dosenPembimbing).filter((nama): nama is string => !!nama))].sort();

  return columnHelper.columns([
    columnHelper.accessor((row) => `${row.namaLengkap} ${row.nim}`, {
      id: "search",
      enableHiding: false,
      filterFn: "includesString",
    }),

    columnHelper.accessor("nim", {
      id: "mahasiswa",
      header: ({ column }) => <DataColumnSort column={column} title="Mahasiswa" />,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <p className="font-medium">{row.original.namaLengkap}</p>
          <p className="text-muted-foreground">{row.original.nim}</p>
        </div>
      ),
    }),

    columnHelper.accessor("kelas.nama", {
      header: ({ column }) => <DataColumnFilter column={column} title="Kelas" options={kelasOptions} />,
      filterFn: "arrHas",
    }),

    columnHelper.accessor((row) => String(row.kelas.angkatan), {
      id: "kelas.angkatan",
      header: ({ column }) => <DataColumnFilter column={column} title="Angkatan" options={angkatanOptions} />,
      filterFn: "arrHas",
    }),

    columnHelper.accessor((row) => (row.tim ? "Terdaftar" : "Tidak Terdaftar"), {
      id: "statusTim",
      header: ({ column }) => <DataColumnFilter column={column} title="Status Tim" options={StatusTimOptions} />,
      filterFn: "arrHas",
      cell: ({ getValue }) => {
        const status = getValue();

        return <Badge className={cn(status === "Terdaftar" ? "bg-green-500/15 text-green-500" : neutralBadge)}>{status}</Badge>;
      },
    }),

    columnHelper.accessor((row) => row.proposal?.status ?? "Belum Upload", {
      id: "statusProposal",
      header: ({ column }) => <DataColumnFilter column={column} title="Status Proposal" options={StatusProposalOptions} />,
      filterFn: "arrHas",
      cell: ({ getValue }) => {
        const status = getValue();

        return <Badge className={cn(status === "Belum Upload" ? neutralBadge : proposalStatusStyles[status as StatusProposal])}>{status}</Badge>;
      },
    }),

    columnHelper.accessor((row) => row.resume?.status ?? "Belum Upload", {
      id: "statusResume",
      header: ({ column }) => <DataColumnFilter column={column} title="Status Resume" options={StatusResumeOptions} />,
      filterFn: "arrHas",
      cell: ({ getValue }) => {
        const status = getValue();

        return <Badge className={cn(status === "Belum Upload" ? neutralBadge : resumeStatusStyles[status as StatusResume])}>{status}</Badge>;
      },
    }),

    columnHelper.accessor("dosenPembimbing", {
      header: ({ column }) => <DataColumnFilter column={column} title="Dosen Pembimbing" options={dosenPembimbingOptions} />,
      filterFn: "arrHas",
      cell: ({ getValue }) => (getValue() ? <span>{getValue()}</span> : <Badge className={neutralBadge}>Belum Ditentukan</Badge>),
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
