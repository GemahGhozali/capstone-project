"use client";

import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { IconNut } from "@tabler/icons-react";
import { DataTableFeatures } from "@/components/data/features";
import { ReactTable, RowData } from "@tanstack/react-table";
import { StatusBookingBimbingan } from "@/generated/prisma/enums";
import { JadwalBimbinganMahasiswa } from "../types";
import { BookingBimbinganFormSheet } from "./booking-bimbingan-form-sheet";

interface BookingBimbinganMahasiswaTableToolbarProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
  jadwalList: JadwalBimbinganMahasiswa[];
}

export function BookingBimbinganMahasiswaTableToolbar<TData extends RowData>({
  table,
  jadwalList,
}: BookingBimbinganMahasiswaTableToolbarProps<TData>) {
  const statusFilter = (table.getColumn("status")?.getFilterValue() as string) ?? "";

  const handleFilterStatus = (value: string) => {
    table.getColumn("status")?.setFilterValue(value);
  };

  const filterActiveClass =
    "border-sidebar-primary/40! bg-sidebar-primary/10! text-sidebar-primary hover:bg-sidebar-primary/10 hover:text-sidebar-primary aria-expanded:bg-sidebar-primary/10 aria-expanded:text-sidebar-primary";

  return (
    <div className="flex gap-3 max-sm:flex-col">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className={cn(statusFilter !== "" && filterActiveClass)}>
              <IconNut data-icon="inline-start" />
              Status Booking
            </Button>
          }
        />
        <DropdownMenuContent className="sm:w-fit">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Status Booking</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={statusFilter} onValueChange={handleFilterStatus}>
              <DropdownMenuRadioItem value="">Semua</DropdownMenuRadioItem>
              {Object.values(StatusBookingBimbingan).map((status) => (
                <DropdownMenuRadioItem key={status} value={status}>
                  {status}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <BookingBimbinganFormSheet jadwalList={jadwalList} />
    </div>
  );
}
