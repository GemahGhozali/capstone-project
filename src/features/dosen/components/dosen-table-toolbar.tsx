"use client";

import Link from "next/link";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { StatusDosen } from "@/generated/prisma/enums";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { IconBadge, IconNut, IconPlus, IconSearch } from "@tabler/icons-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

interface DosenTableToolbarProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function DosenTableToolbar<TData extends RowData>({ table }: DosenTableToolbarProps<TData>) {
  const searchQuery = (table.getColumn("namaLengkap")?.getFilterValue() as string) ?? "";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? "";
  const roleFilter = (table.getColumn("role")?.getFilterValue() as string) ?? "";

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    table.getColumn("namaLengkap")?.setFilterValue(event.target.value);
  };

  const handleFilterStatus = (value: any) => {
    table.getColumn("status")?.setFilterValue(value);
  };

  const handleFilterRole = (value: any) => {
    table.getColumn("role")?.setFilterValue(value);
  };

  const statusFilterActive = statusFilter !== "";
  const roleFilterActive = roleFilter !== "";

  const filterActiveClass =
    "border-primary/40 bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary aria-expanded:bg-primary/10 aria-expanded:text-primary";

  return (
    <div className="flex gap-3 max-sm:flex-col">
      <InputGroup className="sm:max-w-80">
        <InputGroupAddon align="inline-start">
          <IconSearch className="text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Cari nama dosen disini..." value={searchQuery} onChange={handleSearch} />
      </InputGroup>
      <div className="flex gap-3 max-sm:*:grow">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" className={cn(statusFilterActive && filterActiveClass)}>
                <IconNut data-icon="inline-start" />
                Status Dosen
              </Button>
            }
          />
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Status Dosen</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={statusFilter} onValueChange={handleFilterStatus}>
                <DropdownMenuRadioItem value="">Semua</DropdownMenuRadioItem>
                {Object.keys(StatusDosen).map((status) => (
                  <DropdownMenuRadioItem key={status} value={status}>
                    {status}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" className={cn(roleFilterActive && filterActiveClass)}>
                <IconBadge data-icon="inline-start" />
                Role Dosen
              </Button>
            }
          />
          <DropdownMenuContent className="w-fit">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Role Dosen</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={roleFilter} onValueChange={handleFilterRole}>
                <DropdownMenuRadioItem value="">Semua</DropdownMenuRadioItem>
                {["Dosen Capstone Project", "Dosen Pembimbing", "Kaprodi"].map((role) => (
                  <DropdownMenuRadioItem key={role} value={role}>
                    {role}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Link href="/kaprodi/daftar-dosen/tambah" className="sm:ml-auto">
        <Button className="max-sm:w-full">
          Tambah Dosen <IconPlus data-icon="inline-end" />
        </Button>
      </Link>
    </div>
  );
}
