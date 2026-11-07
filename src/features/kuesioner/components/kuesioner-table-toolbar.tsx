"use client";

import React from "react";

import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { StatusKuesioner } from "@/generated/prisma/enums";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { IconNut, IconPlus, IconSearch } from "@tabler/icons-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

interface KuesionerTableToolbarProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
  onCreate: () => void;
}

export function KuesionerTableToolbar<TData extends RowData>({ table, onCreate }: KuesionerTableToolbarProps<TData>) {
  const searchQuery = (table.getColumn("search")?.getFilterValue() as string) ?? "";
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? "";

  const handleSearchKuesioner = (event: React.ChangeEvent<HTMLInputElement>) => {
    table.getColumn("search")?.setFilterValue(event.target.value);
  };

  const handleFilterStatus = (value: string) => {
    table.getColumn("status")?.setFilterValue(value);
  };

  const filterActiveClass =
    "border-sidebar-primary/40! bg-sidebar-primary/10! text-sidebar-primary hover:bg-sidebar-primary/10 hover:text-sidebar-primary aria-expanded:bg-sidebar-primary/10 aria-expanded:text-sidebar-primary";

  return (
    <div className="flex gap-3 max-sm:flex-col">
      <InputGroup className="sm:max-w-96">
        <InputGroupAddon align="inline-start">
          <IconSearch className="text-muted-foreground" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Cari kuesioner disini..." value={searchQuery} onChange={handleSearchKuesioner} />
      </InputGroup>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className={cn(statusFilter !== "" && filterActiveClass)}>
              <IconNut data-icon="inline-start" />
              Status Kuesioner
            </Button>
          }
        />
        <DropdownMenuContent className="sm:w-fit">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Status Kuesioner</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={statusFilter} onValueChange={handleFilterStatus}>
              <DropdownMenuRadioItem value="">Semua</DropdownMenuRadioItem>
              {Object.values(StatusKuesioner).map((status) => (
                <DropdownMenuRadioItem key={status} value={status}>
                  {status}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button className="sm:ml-auto" onClick={onCreate}>
        Tambah Kuesioner
        <IconPlus data-icon="inline-end" />
      </Button>
    </div>
  );
}
