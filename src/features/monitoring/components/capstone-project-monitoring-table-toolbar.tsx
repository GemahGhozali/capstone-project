"use client";

import React from "react";

import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { StatusProposal, StatusResume } from "@/generated/prisma/enums";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { IconClipboardText, IconFileDescription, IconAdjustments, IconSearch, IconUsers } from "@tabler/icons-react";

const StatusTimOptions = ["Terdaftar", "Tidak Terdaftar"];
const StatusProposalOptions = ["Belum Upload", ...Object.keys(StatusProposal)];
const StatusResumeOptions = ["Belum Upload", ...Object.keys(StatusResume)];

const ColumnLabels: Record<string, string> = {
  kelas_nama: "Kelas",
  kelas_angkatan: "Angkatan",
  dosenPembimbing: "Dosen Pembimbing",
  statusTim: "Status Tim",
  statusProposal: "Status Proposal",
  statusResume: "Status Resume",
};

interface CapstoneProjectMonitoringTableToolbarProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function CapstoneProjectMonitoringTableToolbar<TData extends RowData>({ table }: CapstoneProjectMonitoringTableToolbarProps<TData>) {
  const searchQuery = (table.getColumn("search")?.getFilterValue() as string) ?? "";
  const statusTimFilter = (table.getColumn("statusTim")?.getFilterValue() as string) ?? "";
  const statusProposalFilter = (table.getColumn("statusProposal")?.getFilterValue() as string) ?? "";
  const statusResumeFilter = (table.getColumn("statusResume")?.getFilterValue() as string) ?? "";

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    table.getColumn("search")?.setFilterValue(event.target.value);
  };

  return (
    <div className="flex gap-3 max-xl:flex-col xl:justify-between">
      <div className="flex gap-3 max-[480px]:flex-col">
        <InputGroup className="xl:max-w-80 xl:shrink-0">
          <InputGroupAddon align="inline-start">
            <IconSearch className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput placeholder="Cari NIM atau nama mahasiswa disini..." value={searchQuery} onChange={handleSearch} />
        </InputGroup>
        <ColumnVisibilityDropdown table={table} labels={ColumnLabels} />
      </div>

      <div className="flex gap-3 max-sm:flex-col max-xl:*:grow">
        <StatusFilterDropdown
          label="Status Tim"
          icon={<IconUsers />}
          value={statusTimFilter}
          options={StatusTimOptions}
          onChange={(value) => table.getColumn("statusTim")?.setFilterValue(value)}
        />

        <StatusFilterDropdown
          label="Status Proposal"
          icon={<IconClipboardText />}
          value={statusProposalFilter}
          options={StatusProposalOptions}
          onChange={(value) => table.getColumn("statusProposal")?.setFilterValue(value)}
        />

        <StatusFilterDropdown
          label="Status Resume"
          icon={<IconFileDescription />}
          value={statusResumeFilter}
          options={StatusResumeOptions}
          onChange={(value) => table.getColumn("statusResume")?.setFilterValue(value)}
        />
      </div>
    </div>
  );
}

interface StatusFilterDropdownProps {
  label: string;
  icon?: React.ReactNode;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function StatusFilterDropdown({ label, icon, value, options, onChange }: StatusFilterDropdownProps) {
  const filterActiveClass =
    "border-sidebar-primary/40! bg-sidebar-primary/10! text-sidebar-primary hover:bg-sidebar-primary/10 hover:text-sidebar-primary aria-expanded:bg-sidebar-primary/10 aria-expanded:text-sidebar-primary";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" className={cn(value !== "" && filterActiveClass)} />}>
        {icon}
        <span>{label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
            <DropdownMenuRadioItem value="">Semua</DropdownMenuRadioItem>
            {options.map((option) => (
              <DropdownMenuRadioItem key={option} value={option}>
                {option}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ColumnVisibilityDropdownProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
  labels: Record<string, string>;
}

function ColumnVisibilityDropdown<TData extends RowData>({ table, labels }: ColumnVisibilityDropdownProps<TData>) {
  const toggleableColumns = table.getAllLeafColumns().filter((column) => column.getCanHide() && labels[column.id]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        <IconAdjustments />
        <span>Kolom</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-[480px]:w-fit">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
          {toggleableColumns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(checked) => column.toggleVisibility(Boolean(checked))}
            >
              {labels[column.id]}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
