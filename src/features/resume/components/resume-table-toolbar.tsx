"use client";

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
import { StatusResume } from "@/generated/prisma/enums";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { IconNut, IconSearch } from "@tabler/icons-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

interface ResumeTableToolbarProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function ResumeTableToolbar<TData extends RowData>({ table }: ResumeTableToolbarProps<TData>) {
  const searchQuery = (table.getColumn("search")?.getFilterValue() as string) ?? "";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? "";

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    table.getColumn("search")?.setFilterValue(event.target.value);
  };

  const handleFilterStatus = (value: string) => {
    table.getColumn("status")?.setFilterValue(value);
  };

  const statusFilterActive = statusFilter !== "";

  const filterActiveClass =
    "border-sidebar-primary/40! bg-sidebar-primary/10! text-sidebar-primary hover:bg-sidebar-primary/10 hover:text-sidebar-primary aria-expanded:bg-sidebar-primary/10 aria-expanded:text-sidebar-primary";

  return (
    <div className="flex gap-3 max-sm:flex-col">
      <InputGroup className="sm:max-w-96">
        <InputGroupAddon align="inline-start">
          <IconSearch className="text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Cari nama atau NIM mahasiswa disini..." value={searchQuery} onChange={handleSearch} />
      </InputGroup>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className={cn(statusFilterActive && filterActiveClass)}>
              <IconNut data-icon="inline-start" />
              Status Resume
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Status Resume</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={statusFilter} onValueChange={handleFilterStatus}>
              <DropdownMenuRadioItem value="">Semua</DropdownMenuRadioItem>
              {Object.keys(StatusResume).map((status) => (
                <DropdownMenuRadioItem key={status} value={status}>
                  {status}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
