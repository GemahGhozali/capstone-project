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
import { StatusMahasiswa } from "@/generated/prisma/enums";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { IconNut, IconPlus, IconSearch } from "@tabler/icons-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

interface MahasiswaTableToolbarProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function MahasiswaTableToolbar<TData extends RowData>({ table }: MahasiswaTableToolbarProps<TData>) {
  const searchQuery = (table.getColumn("namaLengkap")?.getFilterValue() as string) ?? "";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? "";

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    table.getColumn("namaLengkap")?.setFilterValue(event.target.value);
  };

  const handleFilterStatus = (value: any) => {
    table.getColumn("status")?.setFilterValue(value);
  };

  const statusFilterActive = statusFilter !== "";

  const filterActiveClass =
    "border-primary/40 bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary aria-expanded:bg-primary/10 aria-expanded:text-primary";

  return (
    <div className="flex gap-3 max-sm:flex-col">
      <InputGroup className="sm:max-w-80">
        <InputGroupAddon align="inline-start">
          <IconSearch className="text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Cari nama mahasiswa disini..." value={searchQuery} onChange={handleSearch} />
      </InputGroup>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className={cn(statusFilterActive && filterActiveClass)}>
              <IconNut data-icon="inline-start" />
              Status Mahasiswa
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Status Mahasiswa</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={statusFilter} onValueChange={handleFilterStatus}>
              <DropdownMenuRadioItem value="">Semua</DropdownMenuRadioItem>
              {Object.keys(StatusMahasiswa).map((status) => (
                <DropdownMenuRadioItem key={status} value={status}>
                  {status}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Link href="/kaprodi/daftar-mahasiswa/tambah" className="sm:ml-auto">
        <Button className="max-sm:w-full">
          Tambah Mahasiswa <IconPlus data-icon="inline-end" />
        </Button>
      </Link>
    </div>
  );
}
